from __future__ import annotations

from pathlib import Path
import json
import statistics
import subprocess
import tempfile
from PIL import Image
import numpy as np
import cv2

ROOT = Path(__file__).resolve().parents[5]
ART = ROOT / 'art/characters/gojo/production/run-jkl'
PUBLIC = ROOT / 'public/reviews/gojo-run-jkl'
IDLE = ROOT / 'art/characters/gojo/reference/idle_approved.png'
NEUTRAL = ROOT / 'art/characters/gojo/reference/title_neutral_approved.png'
MAGENTA = (255, 0, 255)
NAMES = ('J', 'K', 'L')
TITLES = {'J': 'Easy long stride', 'K': 'Fast athletic', 'L': 'Upright showboat'}


def foreground(rgb: np.ndarray):
    return ~((rgb[:, :, 0] > 220) & (rgb[:, :, 1] < 60) & (rgb[:, :, 2] > 150))


def component_frames(image: Image.Image):
    rgb = image.convert('RGB')
    data = np.asarray(rgb)
    mask = foreground(data).astype('uint8')
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    components = []
    for component_id in range(1, count):
        x, y, width, height, area = [int(v) for v in stats[component_id]]
        if area > 1000:
            components.append((area, component_id, (x, y, x + width, y + height)))
    if len(components) != 8:
        raise ValueError(f'expected exactly 8 isolated figures, found {len(components)}')
    components.sort(key=lambda item: item[2][0])
    frames = []
    for _, component_id, box in components:
        alpha = Image.fromarray((labels == component_id).astype('uint8') * 255)
        sprite = rgb.crop(box).convert('RGBA')
        sprite.putalpha(alpha.crop(box))
        frames.append((sprite, box))
    return frames


def anchor_sprite(image: Image.Image):
    rgba = image.convert('RGBA')
    alpha = np.asarray(rgba.getchannel('A'))
    count, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 0).astype('uint8'), 8)
    if count <= 1:
        raise ValueError('approved anchor has no visible pixels')
    component_id = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    ys, xs = np.where(labels == component_id)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    cropped = rgba.crop(box)
    cropped.putalpha(Image.fromarray((labels[box[1]:box[3], box[0]:box[2]] == component_id).astype('uint8') * 255))
    return cropped


def hair_bounds(image: Image.Image):
    rgba = image.convert('RGBA')
    alpha = np.asarray(rgba.getchannel('A'))
    ys, xs = np.where(alpha > 0)
    if not len(xs):
        raise ValueError('empty figure for hair measurement')
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    visible = rgba.crop(box)
    pixels = np.asarray(visible)
    region = pixels[:max(1, round(visible.height * 0.23))]
    white = (region[:, :, 3] > 0) & (region[:, :, :3].min(2) > 120) & ((region[:, :, :3].max(2) - region[:, :, :3].min(2)) < 65)
    hy, hx = np.where(white)
    if not len(hx):
        raise ValueError('white hair pixels not found')
    return (int(hx.min()), int(hy.min()), int(hx.max()) + 1, int(hy.max()) + 1)


def normalized_cells(name: str, reference_hair: int):
    source_path = ART / f'{name}_v01.png'
    source = Image.open(source_path).convert('RGB')
    source_frames = component_frames(source)
    sprites = [entry[0] for entry in source_frames]
    hairs = [hair_bounds(frame) for frame in sprites]
    hair_widths = [box[2] - box[0] for box in hairs]
    heights = [frame.height for frame in sprites]
    scale_by_hair = reference_hair / statistics.median(hair_widths)
    scale = min(scale_by_hair, 234 / max(heights))
    max_height = max(heights)
    crown_y = 241 - round(max_height * scale)

    cells = []
    measured = []
    for index, (sprite, source_box, hair) in enumerate(zip(sprites, [e[1] for e in source_frames], hairs)):
        size = (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale)))
        resized = sprite.resize(size, Image.Resampling.NEAREST)
        scaled_hair = hair_bounds(resized)
        head_center = (scaled_hair[0] + scaled_hair[2]) / 2
        x = round(128 - head_center)
        y = crown_y
        cell = Image.new('RGBA', (256, 256), MAGENTA + (255,))
        cell.alpha_composite(resized, (x, y))
        alpha = Image.new('L', (256, 256), 0)
        alpha.paste(resized.getchannel('A'), (x, y))
        bounds = alpha.getbbox()
        if not bounds or bounds[0] < 4 or bounds[2] > 252 or bounds[1] < 4 or bounds[3] > 241:
            raise ValueError(f'{name} frame {index} outside safety bounds: {bounds}')
        cell = cell.convert('RGB')
        actual_hair = scaled_hair[2] - scaled_hair[0]
        cells.append(cell)
        measured.append({
            'frame': index,
            'sourceFigureBounds': list(source_box),
            'sourceHairWidth': hair[2] - hair[0],
            'uniformScale': scale,
            'normalizedFigureBounds': list(bounds),
            'normalizedHairWidth': actual_hair,
            'hairWidthDeltaFromNeutralPct': round((actual_hair / reference_hair - 1) * 100, 2),
        })

    idle_frames = component_frames(Image.open(IDLE).convert('RGB'))
    idle_sprite = idle_frames[0][0]
    idle_hair = hair_bounds(idle_sprite)
    idle_scaled = idle_sprite.resize(
        (max(1, round(idle_sprite.width * scale)), max(1, round(idle_sprite.height * scale))),
        Image.Resampling.NEAREST,
    )
    idle_scaled_hair = hair_bounds(idle_scaled)
    idle_x = round(128 - (idle_scaled_hair[0] + idle_scaled_hair[2]) / 2)
    idle_y = 240 - idle_scaled.height
    idle_cell = Image.new('RGBA', (256, 256), MAGENTA + (255,))
    idle_cell.alpha_composite(idle_scaled, (idle_x, idle_y))
    return cells, idle_cell.convert('RGB'), {
        'study': name,
        'title': TITLES[name],
        'sourceSize': list(source.size),
        'normalizedStripSize': [2048, 256],
        'frameCount': len(cells),
        'cellSize': [256, 256],
        'scale': scale,
        'scaleByApprovedHair': scale_by_hair,
        'uniformScale': True,
        'neutralHairWidth': reference_hair,
        'idleF0HairWidthAtStudyScale': idle_scaled_hair[2] - idle_scaled_hair[0],
        'frames': measured,
        'anatomyStatus': 'visual review only; this is not a packed production atlas or approval',
    }


def write_mp4(name: str, frames: list[Image.Image]):
    with tempfile.TemporaryDirectory(prefix=f'.video-{name.lower()}-', dir=ART) as temp:
        frame_dir = Path(temp)
        for i, frame in enumerate(frames * 8):
            frame.save(frame_dir / f'{i:03}.png')
        target = ART / f'{name}_loop_v01.mp4'
        subprocess.run([
            'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
            '-framerate', '50/3', '-i', str(frame_dir / '%03d.png'),
            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
            str(target),
        ], check=True, capture_output=True, text=True)
    decoded = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(target), '-f', 'null', '-'],
        capture_output=True, text=True,
    )
    return {'fps': '50/3', 'frameMs': 60, 'cycles': 8, 'decodeExitCode': decoded.returncode, 'stderr': decoded.stderr[-1000:]}


def main():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    neutral = anchor_sprite(Image.open(NEUTRAL))
    reference_hair = hair_bounds(neutral)[2] - hair_bounds(neutral)[0]
    studies = {}
    idle_cells = {}
    qa = {}
    for name in NAMES:
        studies[name], idle_cells[name], qa[name] = normalized_cells(name, reference_hair)

    palette_source = Image.new('RGB', (2048, 3 * 256), MAGENTA)
    for row, name in enumerate(NAMES):
        for col, cell in enumerate(studies[name]):
            palette_source.paste(cell, (col * 256, row * 256))
    palette = palette_source.quantize(colors=48, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    for name in NAMES:
        studies[name] = [cell.quantize(palette=palette, dither=Image.Dither.NONE).convert('RGB') for cell in studies[name]]
        idle_cells[name] = idle_cells[name].quantize(palette=palette, dither=Image.Dither.NONE).convert('RGB')
        strip = Image.new('RGB', (2048, 256), MAGENTA)
        for i, cell in enumerate(studies[name]):
            strip.paste(cell, (i * 256, 0))
        strip.save(ART / f'{name}_strip_v01.png')

        contact = Image.new('RGB', (2304, 256), MAGENTA)
        contact.paste(idle_cells[name], (0, 0))
        for i, cell in enumerate(studies[name]):
            contact.paste(cell, ((i + 1) * 256, 0))
        contact.save(ART / f'{name}_contact_v01.png')
        studies[name][0].save(
            ART / f'{name}_loop_v01.gif',
            save_all=True,
            append_images=studies[name][1:],
            duration=60,
            loop=0,
            optimize=False,
            disposal=2,
        )
        qa[name]['paletteColors'] = 48
        qa[name]['gif'] = {'frames': 8, 'durationMs': 60, 'infiniteLoop': True}
        qa[name]['mp4'] = write_mp4(name, studies[name])

    comparison = []
    for i in range(8):
        frame = Image.new('RGB', (768, 256), MAGENTA)
        for j, name in enumerate(NAMES):
            frame.paste(studies[name][i], (j * 256, 0))
        comparison.append(frame)
    comparison[0].save(
        ART / 'JKL_comparison_v01.gif',
        save_all=True,
        append_images=comparison[1:],
        duration=60,
        loop=0,
        optimize=False,
        disposal=2,
    )

    outputs = []
    for name in NAMES:
        outputs.extend([
            ART / f'{name}_strip_v01.png',
            ART / f'{name}_contact_v01.png',
            ART / f'{name}_loop_v01.gif',
            ART / f'{name}_loop_v01.mp4',
            ART / f'{name}_qa_v01.json',
        ])
        gif = Image.open(ART / f'{name}_loop_v01.gif')
        qa[name]['gif'] = {'frames': gif.n_frames, 'durationMs': gif.info.get('duration'), 'infiniteLoop': gif.info.get('loop') == 0}
        (ART / f'{name}_qa_v01.json').write_text(json.dumps(qa[name], indent=2), encoding='utf-8')

    combined = Image.open(ART / 'JKL_comparison_v01.gif')
    combined_qa = {'frames': combined.n_frames, 'durationMs': combined.info.get('duration'), 'infiniteLoop': combined.info.get('loop') == 0}
    outputs.append(ART / 'JKL_comparison_v01.gif')

    package_qa = {
        'date': '2026-10-15',
        'timezone': 'America/Los_Angeles',
        'branch': 'art/gojo-run',
        'approvedNeutralHairWidth': reference_hair,
        'comparisonGif': combined_qa,
        'studies': qa,
    }
    (ART / 'package_qa_v01.json').write_text(json.dumps(package_qa, indent=2), encoding='utf-8')
    outputs.append(ART / 'package_qa_v01.json')

    for path in outputs:
        (PUBLIC / path.name).write_bytes(path.read_bytes())
    (PUBLIC / 'package_qa_v01.json').write_bytes((ART / 'package_qa_v01.json').read_bytes())

    rows = []
    for name in NAMES:
        rows.append(f"""
<section><h2>{name} — {TITLES[name]}</h2>
<p><a href=\"{name}_contact_v01.png\">Contact sheet (idle f0 + frames 0–7)</a> ·
<a href=\"{name}_loop_v01.gif\">GIF</a> · <a href=\"{name}_loop_v01.mp4\">MP4</a> ·
<a href=\"{name}_strip_v01.png\">8 × 256 strip</a></p>
<img class=\"contact\" src=\"{name}_contact_v01.png\" alt=\"{name} contact sheet with approved idle frame 0 and run frames 0 through 7\">
<video controls loop muted playsinline preload=\"metadata\"><source src=\"{name}_loop_v01.mp4\" type=\"video/mp4\"></video>
</section>""")
    html = """<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
<title>Gojo run direction studies J/K/L</title><style>
:root{color-scheme:dark}body{margin:0;background:#101622;color:#e7eef5;font:16px system-ui,sans-serif}
main{max-width:1200px;margin:0 auto;padding:24px}p{line-height:1.5}section{margin:28px 0;padding:20px;background:#192333;border-radius:12px;overflow:auto}
img.contact{display:block;width:min(100%,1152px);height:auto;image-rendering:pixelated;margin:16px 0}
video{width:min(100%,256px);height:auto;background:#f0f}a{color:#9bd5ff}figure img{display:block;width:min(100%,768px);image-rendering:pixelated}
</style></head><body><main><h1>Gojo run direction studies J / K / L</h1>
<p>Unapproved direction candidates. Each contact sheet shows approved idle f0 beside run frames 0–7 at one scale.
Playback is 60 ms per frame. Compare stride, leg identity, hand placement, and the loop seam. The selected direction
will still need a separate production strip and technical review.</p>
<figure><figcaption>J / K / L comparison loop</figcaption><img src=\"JKL_comparison_v01.gif\" alt=\"J, K, and L side by side through their eight frames\"></figure>
""" + ''.join(rows) + """</main></body></html>"""
    (PUBLIC / 'index.html').write_text(html, encoding='utf-8')
    (ART / 'package_qa_v01.json').write_text(json.dumps(package_qa, indent=2), encoding='utf-8')
    (PUBLIC / 'package_qa_v01.json').write_text(json.dumps(package_qa, indent=2), encoding='utf-8')
    print(json.dumps(package_qa, indent=2))


if __name__ == '__main__':
    main()

