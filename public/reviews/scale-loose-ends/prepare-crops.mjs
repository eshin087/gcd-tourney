import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(root, 'review-data.json');
const data = JSON.parse(await readFile(dataPath, 'utf8'));
const cropRoot = path.join(root, 'crops');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sourceCache = new Map();
const cropRecords = [];

function safeSegment(value) {
  return value.replace(/[^a-z0-9-]/gi, '-');
}

async function loadSource(key) {
  if (!sourceCache.has(key)) sourceCache.set(key, (async () => {
    const source = data.sources[key];
    const sheetBytes = await readFile(path.join(root, source.sheet));
    const metadataBytes = await readFile(path.join(root, source.metadata));
    const sheetHash = sha256(sheetBytes);
    const metadataHash = sha256(metadataBytes);
    if (source.sheetHash && source.sheetHash !== sheetHash) throw new Error(`${key} sheet hash mismatch: ${sheetHash}`);
    if (source.metadataHash && source.metadataHash !== metadataHash) throw new Error(`${key} metadata hash mismatch: ${metadataHash}`);
    source.sheetHash = sheetHash;
    source.metadataHash = metadataHash;
    const sheet = PNG.sync.read(sheetBytes);
    const metadata = JSON.parse(metadataBytes.toString('utf8'));
    if (metadata.frameWidth !== 256 || metadata.frameHeight !== 256 || metadata.columns !== 16) {
      throw new Error(`${key} atlas is not 256px cells with 16 columns`);
    }
    return { source, sheet, metadata };
  })());
  return sourceCache.get(key);
}

async function writeCells(key, animationName, indexes, outputPath) {
  const { sheet, metadata, source } = await loadSource(key);
  const { frameWidth, frameHeight, columns } = metadata;
  const output = new PNG({ width: frameWidth * indexes.length, height: frameHeight });
  indexes.forEach((index, framePosition) => {
    const sx = (index % columns) * frameWidth;
    const sy = Math.floor(index / columns) * frameHeight;
    for (let y = 0; y < frameHeight; y += 1) {
      const srcOffset = ((sy + y) * sheet.width + sx) * 4;
      const dstOffset = (y * output.width + framePosition * frameWidth) * 4;
      sheet.data.copy(output.data, dstOffset, srcOffset, srcOffset + frameWidth * 4);
    }
  });
  const bytes = PNG.sync.write(output, { colorType: 6 });
  const file = path.join(root, outputPath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, bytes);
  cropRecords.push({
    output: outputPath,
    sha256: sha256(bytes),
    sourceAtlas: source.sheet,
    sourceAtlasSha256: source.sheetHash,
    sourceMetadataSha256: source.metadataHash,
    animation: animationName,
    sourceFrames: indexes,
    dimensions: `${output.width}x${output.height}`,
  });
}

for (const group of data.groups) {
  const sourceKey = group.sourceKey;
  const idleKey = group.idleSourceKey || sourceKey;
  const { metadata } = await loadSource(sourceKey);
  const idleSource = data.sources[idleKey];
  const idleMetadata = (await loadSource(idleKey)).metadata;
  const idleFrames = idleMetadata.animations.idle?.frames;
  if (!idleFrames?.length) throw new Error(`${idleKey} metadata has no idle frames`);
  const idleFrame = group.approvedIdleFrame ?? idleFrames[0];
  group.idleSource = {
    key: idleKey,
    branch: idleSource.branch,
    commit: idleSource.commit,
    sheetHash: idleSource.sheetHash,
    metadataHash: idleSource.metadataHash,
    frame: idleFrame,
    preview: `crops/approved-idle-${group.id}-v${String(group.approvedIdleVersion).padStart(2, '0')}.png`,
  };
  await writeCells(idleKey, `approved idle v${group.approvedIdleVersion}`, [idleFrame], group.idleSource.preview);
  for (const field of ['neutral', 'combat']) {
    const bytes = await readFile(path.join(root, group[field]));
    const image = PNG.sync.read(bytes);
    if (image.width !== 256 || image.height !== 256) throw new Error(`${group[field]} must be an exact 256x256 approved cell`);
    group[`${field}Hash`] = sha256(bytes);
  }

  for (const item of group.items) {
    const animation = metadata.animations[item.animation];
    if (!animation) throw new Error(`${sourceKey} metadata is missing ${item.animation}`);
    if (animation.frames.length !== item.frames || animation.durations.length !== item.frames) {
      throw new Error(`${item.animation} has ${animation.frames.length} packed frames; review data says ${item.frames}`);
    }
    item.sourceFrames = animation.frames;
    item.durations = animation.durations;
    item.loop = animation.loop === true;
    item.oneShot = !item.loop;
    item.preview = `crops/${safeSegment(group.id)}/${safeSegment(item.animation)}.png`;
    await writeCells(sourceKey, item.animation, animation.frames, item.preview);
    if (item.baseAnimation) {
      const baseKey = item.baseSourceKey || sourceKey;
      const baseMetadata = (await loadSource(baseKey)).metadata;
      const base = baseMetadata.animations[item.baseAnimation];
      if (!base?.frames?.length) throw new Error(`Base animation ${item.baseAnimation} missing from ${sourceKey}`);
      item.baseSourceFrames = base.frames;
      item.basePreview = `crops/${safeSegment(group.id)}/base-${safeSegment(item.baseAnimation)}.png`;
      await writeCells(baseKey, item.baseAnimation, base.frames, item.basePreview);
    }
  }
}

if (data.groups.reduce((count, group) => count + group.items.length, 0) !== data.total) {
  throw new Error('Review item count does not match declared total');
}

await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`);
await writeFile(path.join(cropRoot, 'manifest.json'), `${JSON.stringify({
  generatedBy: 'prepare-crops.mjs',
  method: 'Exact 256x256 RGBA cell extraction from copied packed atlas frames; no resize or color changes.',
  sourceAtlases: Object.fromEntries(Object.entries(data.sources).map(([key, source]) => [key, {
    branch: source.branch,
    commit: source.commit,
    sheet: source.sheet,
    sheetSha256: source.sheetHash,
    metadata: source.metadata,
    metadataSha256: source.metadataHash,
  }])),
  crops: cropRecords,
}, null, 2)}\n`);
console.log(`Prepared ${cropRecords.length} exact cell strips for ${data.total} review cards.`);
