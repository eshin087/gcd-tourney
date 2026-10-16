from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import statistics
import subprocess
import tempfile
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
PUBLIC = ROOT / 'public/reviews/gojo-run-jkl'
BASE_PATH = HERE / 'package_run_jkl.py'
spec = importlib.util.spec_from_file_location('run_jkl_v01', BASE_PATH)
base = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(base)
MAGENTA = base.MAGENTA
NAMES = ('J', 'L')
VERSION = 'v02'


def normalize(name: str, neutral_hair_width: int):
    source_path = HERE / f'{name}_{VERSION}.png'
    source = Image.open(source_path).convert('RGB')
    source_frames = base.component_frames(source)
    sprites = [item[0] for item in source_frames]
    hairs = [base.hair_bounds(frame) for frame in sprites]
    widths = [box[2] - box[0] for box in hairs]
    heights = [frame.height for frame in sprites]
    scale_hair = neutral_hair_width / statistics.median(widths)
    scale = min(scale_hair, 234 / max(heights))
    crown_y = 241 - round(max(heights) * scale)
    cells, measurements = [], []
    for i, (sprite, source_box, hair) in enumerate(zip(sprites, [x[1] for x in source_frames], hairs)):
        size = (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale)))
        resized = sprite.resize(size, Image.Resampling.NEAREST)
        scaled_hair = base.hair_bounds(resized)
        x = round(128 - (scaled_hair[0] + scaled_hair[2]) / 2)
        cell = Image.new('RGBA', (256, 256), MAGENTA + (255,))
        cell.alpha_composite(resized, (x, crown_y))
        alpha = Image.new('L', (256, 256), 0)
        alpha.paste(resized.getchannel('A'), (x, crown_y))
        bounds = alpha.getbbox()
        if not bounds or bounds[0] < 4 or bounds[2] > 252 or bounds[1] < 4 or bounds[3] > 241:
            raise ValueError(f'{name} {VERSION} f{i} outside safety bounds: {bounds}')
        scaled_hair_width = scaled_hair[2] - scaled_hair[0]
        cells.append(cell.convert('RGB'))
        measurements.append({
            'frame': i,
            'sourceFigureBounds': list(source_box),
            'sourceHairWidth': hair[2] - hair[0],
            'uniformScale': scale,
            'normalizedFigureBounds': list(bounds),
            'hairToSolePx': bounds[3] - bounds[1],
            'posedWidthPx': bounds[2] - bounds[0],
            'normalizedHairWidth': scaled_hair_width,
            'hairWidthDeltaFromNeutralPct': round((scaled_hair_width / neutral_hair_width - 1) * 100, 2),
        })

    idle_frames = base.component_frames(Image.open(base.IDLE).convert('RGB'))
    idle = idle_frames[0][0]
    idle_scaled = idle.resize((max(1, round(idle.width * scale)), max(1, round(idle.height * scale))), Image.Resampling.NEAREST)
    idle_hair = base.hair_bounds(idle_scaled)
    idle_x = round(128 - (idle_hair[0] + idle_hair[2]) / 2)
    idle_y = 240 - idle_scaled.height
    idle_cell = Image.new('RGBA', (256, 256), MAGENTA + (255,))
    idle_cell.alpha_composite(idle_scaled, (idle_x, idle_y))
    return cells, idle_cell.convert('RGB'), {
        'study': name, 'version': VERSION, 'sourceSize': list(source.size), 'frameCount': len(cells),
        'cellSize': [256, 256], 'scale': scale, 'uniformScale': True,
        'neutralHairWidthPx': neutral_hair_width,
        'maxHairToSolePx': max(m['hairToSolePx'] for m in measurements),
        'frames': measurements,
        'visualQA': 'Review leg identity, far-hand pocket continuity, mirrored phases, and f7-to-f0 seam; posed envelope is not body-height approval.',
    }


def save_loop(name: str, cells: list[Image.Image]):
    target = HERE / f'{name}_loop_{VERSION}.mp4'
    with tempfile.TemporaryDirectory(prefix=f'.video-{name.lower()}-{VERSION}-', dir=HERE) as temp:
        frame_dir = Path(temp)
        for i, frame in enumerate(cells * 8):
            frame.save(frame_dir / f'{i:03}.png')
        subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-framerate', '50/3', '-i', str(frame_dir / '%03d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(target)], check=True, capture_output=True, text=True)
    check = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(target), '-f', 'null', '-'], capture_output=True, text=True)
    if check.returncode:
        raise RuntimeError(check.stderr)
    cells[0].save(HERE / f'{name}_loop_{VERSION}.gif', save_all=True, append_images=cells[1:], duration=60, loop=0, optimize=False, disposal=2)
    return {'mp4DecodeExitCode': check.returncode, 'mp4Cycles': 8, 'fps': '50/3', 'gifFrames': 8, 'gifDurationMs': 60, 'gifInfiniteLoop': True}


def main():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    neutral = base.anchor_sprite(Image.open(base.NEUTRAL))
    neutral_hair = base.hair_bounds(neutral)[2] - base.hair_bounds(neutral)[0]
    studies, idle_cells, qa = {}, {}, {}
    for name in NAMES:
        studies[name], idle_cells[name], qa[name] = normalize(name, neutral_hair)

    qa['J']['studyStatus'] = 'needs review; technical hold'
    qa['J']['holds'] = [
        'Frames 4–7 appear to reuse the same lead-leg pattern rather than mirror f0–f3.',
        'Source f0 touches the left edge of the generation canvas (sourceFigureBounds x0=0); normalization cannot recover missing edge pixels.',
    ]
    qa['L']['studyStatus'] = 'needs review; technical hold'
    qa['L']['holds'] = [
        'f0/f4 and f3/f7 repeat the same lead leg; the required mirrored phase and leg identity remain unresolved.',
    ]

    # Preserve the existing K_v01 comparison pixels by slicing its already-normalized strip.
    k_strip = Image.open(HERE / 'K_strip_v01.png').convert('RGB')
    studies['K'] = [k_strip.crop((i * 256, 0, (i + 1) * 256, 256)) for i in range(8)]
    all_for_palette = Image.new('RGB', (2048, 3 * 256), MAGENTA)
    for row, name in enumerate(('J', 'K', 'L')):
        for col, frame in enumerate(studies[name]):
            all_for_palette.paste(frame, (col * 256, row * 256))
    palette = all_for_palette.quantize(colors=48, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    for name in NAMES:
        studies[name] = [frame.quantize(palette=palette, dither=Image.Dither.NONE).convert('RGB') for frame in studies[name]]
        idle_cells[name] = idle_cells[name].quantize(palette=palette, dither=Image.Dither.NONE).convert('RGB')
        strip = Image.new('RGB', (2048, 256), MAGENTA)
        for i, frame in enumerate(studies[name]): strip.paste(frame, (i * 256, 0))
        strip.save(HERE / f'{name}_strip_{VERSION}.png')
        contact = Image.new('RGB', (2304, 256), MAGENTA)
        contact.paste(idle_cells[name], (0, 0))
        for i, frame in enumerate(studies[name]): contact.paste(frame, ((i + 1) * 256, 0))
        contact.save(HERE / f'{name}_contact_{VERSION}.png')
        qa[name]['paletteColors'] = 48
        qa[name]['loopMedia'] = save_loop(name, studies[name])
        (HERE / f'{name}_qa_{VERSION}.json').write_text(json.dumps(qa[name], indent=2) + '\n', encoding='utf-8')

    comparison = []
    for i in range(8):
        frame = Image.new('RGB', (768, 256), MAGENTA)
        for j, name in enumerate(('J', 'K', 'L')): frame.paste(studies[name][i], (j * 256, 0))
        comparison.append(frame)
    comparison[0].save(HERE / 'JKL_comparison_v02.gif', save_all=True, append_images=comparison[1:], duration=60, loop=0, optimize=False, disposal=2)
    gif = Image.open(HERE / 'JKL_comparison_v02.gif')
    package = {'date': '2026-10-15', 'branch': 'art/gojo-run', 'redo': ['J_v02', 'L_v02'], 'unchangedDirectionReference': 'K_v01', 'approvedNeutralHairWidthPx': neutral_hair, 'comparison': {'frames': gif.n_frames, 'durationMs': gif.info.get('duration'), 'infiniteLoop': gif.info.get('loop') == 0}, 'studies': qa, 'approval': 'Unapproved direction studies only; user review required.'}
    (HERE / 'package_qa_v02.json').write_text(json.dumps(package, indent=2) + '\n', encoding='utf-8')

    names = [f'{n}_{kind}_{VERSION}.{ext}' for n in NAMES for kind, ext in [('strip','png'),('contact','png'),('loop','gif'),('loop','mp4'),('qa','json')]]
    names += ['JKL_comparison_v02.gif', 'package_qa_v02.json']
    for name in names: (PUBLIC / name).write_bytes((HERE / name).read_bytes())
    print(json.dumps(package, indent=2))


if __name__ == '__main__':
    main()
