#!/usr/bin/env python3
"""Offline 16:9 storyboard renderer. No keys, telemetry or paid APIs."""
import argparse
import json
import math
import os
from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageDraw, ImageFont, ImageOps
import imageio_ffmpeg


def ffmpeg():
    return shutil.which('ffmpeg') or imageio_ffmpeg.get_ffmpeg_exe()


def asset(base, value):
    path = (base / value).resolve()
    if not path.is_file():
        raise ValueError(f'Asset not found: {path}')
    return path


def validate(data, base):
    width, height = data.get('size', [1920, 1080])
    if not all(isinstance(v, int) and not isinstance(v, bool) for v in (width, height)):
        raise ValueError('Size must contain integers')
    if width * 9 != height * 16 or width % 2 or height % 2 or not 320 <= width <= 3840:
        raise ValueError('Size must be even, 16:9, width 320..3840')
    fps = data.get('fps', 24)
    if not isinstance(fps, int) or not 1 <= fps <= 60:
        raise ValueError('FPS must be 1..60')
    scenes = data.get('scenes', [])
    if not 1 <= len(scenes) <= 100:
        raise ValueError('Supply 1..100 scenes')
    for scene in scenes:
        duration = scene.get('duration', 4)
        if not isinstance(duration, (float, int)) or not math.isfinite(duration) or not 0.5 <= duration <= 60:
            raise ValueError('Scene duration must be 0.5..60 seconds')
        if scene.get('drawing', 'abstract') not in ('abstract', 'room'):
            raise ValueError('drawing must be abstract or room')
        if scene.get('photo'):
            asset(base, scene['photo'])
    for key in ('font', 'font_bold', 'logo', 'audio'):
        if data.get(key):
            asset(base, data[key])
    if sum(s.get('duration', 4) for s in scenes) > 600:
        raise ValueError('Maximum total duration: 600 seconds')
    return width, height, fps


def font(data, base, bold, size):
    key = 'font_bold' if bold else 'font'
    if data.get(key):
        return ImageFont.truetype(str(asset(base, data[key])), size)
    name = 'DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'
    for path in (Path('/usr/share/fonts/truetype/dejavu') / name, Path(name)):
        try:
            return ImageFont.truetype(str(path), size)
        except OSError:
            pass
    raise ValueError('No Unicode font found. Set font and font_bold to licensed TTF paths.')


def wrapped(draw, text, face, width):
    lines = []
    for paragraph in text.split('\n'):
        line = ''
        for word in paragraph.split():
            candidate = (line + ' ' + word).strip()
            if draw.textlength(candidate, font=face) > width:
                if not line:
                    raise ValueError(f'Word too wide: {word}; shorten text or choose a smaller font')
                lines.append(line)
                line = word
                if draw.textlength(word, font=face) > width:
                    raise ValueError(f'Word too wide: {word}')
            else:
                line = candidate
        lines.append(line)
    return lines


def frame(data, scene, base, progress, index):
    w, h = data.get('size', [1920, 1080])
    scale = w / 1920
    bg = data.get('background', '#101c29')
    accent = data.get('accent', '#efb86b')
    image = Image.new('RGB', (w, h), bg)
    draw = ImageDraw.Draw(image)
    if scene.get('photo'):
        with Image.open(asset(base, scene['photo'])) as source:
            source = ImageOps.exif_transpose(source).convert('RGB')
            zoom = 1.03 + progress * 0.06
            cover = ImageOps.fit(source, (round(w * zoom), round(h * zoom)))
            left, top = (cover.width - w) // 2, (cover.height - h) // 2
            image = cover.crop((left, top, left + w, top + h))
        shade = Image.new('RGB', (w, h), bg)
        image = Image.blend(image, shade, 0.58)
        draw = ImageDraw.Draw(image)
    elif scene.get('drawing') == 'room':
        # Deliberately illustrative perspective; never presented as a real location.
        draw.polygon([(w*.58,h*.20),(w*.9,h*.28),(w*.9,h*.72),(w*.58,h*.8)], fill='#263749')
        draw.polygon([(w*.58,h*.8),(w*.9,h*.72),(w,h),(w*.45,h)], fill='#34434d')
        draw.rectangle((w*.65,h*.3,w*.82,h*.53), fill='#adc5c8')
        draw.line((w*.735,h*.3,w*.735,h*.53), fill=bg, width=max(1,round(8*scale)))
        draw.rounded_rectangle((w*.61,h*.64,w*.87,h*.77), radius=round(20*scale), fill=accent)
        draw.ellipse((w*.76,h*.77,w*.94,h*.87), fill='#b98d61')
    else:
        x = w * (.77 + .03 * math.sin(progress * math.pi))
        draw.ellipse((x-w*.17,h*.18,x+w*.17,h*.78), outline=accent, width=max(2,round(5*scale)))
        draw.rounded_rectangle((w*.68,h*.33,w*.86,h*.66), radius=round(32*scale), fill='#294252')
        draw.line((w*.62,h*.73,w*.93,h*.31), fill=accent, width=max(2,round(12*scale)))
    margin = round(w * .065)
    body = font(data, base, False, max(12, round(32*scale)))
    heading = font(data, base, True, max(18, round(data.get('title_size', 80)*scale)))
    draw.text((margin, h*.1), data.get('brand', 'STUDIO').upper(), font=body, fill=accent)
    y = h * .30
    text_width = w * .48
    for text, face, color in ((scene.get('title', ''), heading, '#ffffff'), (scene.get('subtitle', ''), body, '#e1e6eb')):
        for line in wrapped(draw, text, face, text_width):
            if y + face.size * 1.35 > h*.84:
                raise ValueError('Text overflows safe area. Shorten title/subtitle or reduce title_size.')
            draw.text((margin, y), line, font=face, fill=color)
            y += face.size * 1.35
        y += h*.035
    draw.text((margin,h*.90), f'{index+1:02d} / {len(data["scenes"]):02d}', font=body, fill=accent)
    draw.rectangle((margin,h*.865,margin+(w-2*margin)*progress,h*.87), fill=accent)
    if data.get('logo'):
        with Image.open(asset(base, data['logo'])) as source:
            logo = source.convert('RGBA')
            logo.thumbnail((round(w*.16),round(h*.09)))
            image.paste(logo,(w-margin-logo.width,round(h*.08)),logo)
    return image


def extract(video, output, duration):
    output.mkdir(parents=True, exist_ok=True)
    for i in range(5):
        # Center of each fifth avoids start/end black frames.
        subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(duration*(i+.5)/5), '-i', str(video), '-frames:v', '1', str(output / f'frame-{i+1:02d}.png')], check=True)


def render(plan, output):
    plan = Path(plan).resolve()
    data = json.loads(plan.read_text(encoding='utf-8'))
    base = plan.parent
    w, h, fps = validate(data, base)
    output = Path(output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    movie = output / 'video.mp4'
    total_frames = sum(round(s.get('duration',4)*fps) for s in data['scenes'])
    duration = total_frames / fps
    command = [ffmpeg(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(fps), '-i', 'pipe:0']
    if data.get('audio'):
        command += ['-i', str(asset(base, data['audio'])), '-af', 'apad', '-c:a', 'aac']
    command += ['-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-t', str(duration), '-movflags', '+faststart', str(movie)]
    # Preflight each scene before opening the encoder.
    for i, scene in enumerate(data['scenes']):
        frame(data, scene, base, .5, i)
    proc = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for i, scene in enumerate(data['scenes']):
            count = round(scene.get('duration',4)*fps)
            for n in range(count):
                proc.stdin.write(frame(data, scene, base, n/max(1,count-1), i).tobytes())
        proc.stdin.close()
        if proc.wait() != 0:
            raise RuntimeError('FFmpeg encoding failed')
    except BaseException:
        if not proc.stdin.closed:
            proc.stdin.close()
        proc.terminate()
        proc.wait()
        movie.unlink(missing_ok=True)
        raise
    extract(movie, output / 'frames', duration)
    narration = ' '.join(s.get('narration','') for s in data['scenes']).strip()
    (output/'narration.txt').write_text(narration, encoding='utf-8')
    (output/'elevenlabs-prompt.txt').write_text('Dil: Türkçe. Ton: doğal, sıcak, güven veren; reklam abartısı yok. Marka ve özel isim telaffuzunu doğrula. Hedef süre: ' + str(round(duration,2)) + ' saniye. Aşağıdaki metni oku; bu yönlendirmeyi seslendirme.\n\n' + narration, encoding='utf-8')
    (output/'manifest.json').write_text(json.dumps({'size':[w,h], 'fps':fps, 'duration':duration, 'frames':5, 'audio_attached':bool(data.get('audio')), 'renderer':'Pillow + FFmpeg'}, indent=2), encoding='utf-8')
    print(f'Created {movie}; five actual video frames in {output / "frames"}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    run = sub.add_parser('render')
    run.add_argument('plan')
    run.add_argument('--out', default='output')
    frames = sub.add_parser('frames', help='Extract five frames from an existing video')
    frames.add_argument('video')
    frames.add_argument('--duration', required=True, type=float, help='Known video duration in seconds')
    frames.add_argument('--out', default='output/frames')
    args = parser.parse_args()
    if args.command == 'render':
        render(args.plan, args.out)
    else:
        if not math.isfinite(args.duration) or args.duration <= 0:
            parser.error('duration must be positive and finite')
        extract(Path(args.video).resolve(), Path(args.out), args.duration)


if __name__ == '__main__':
    main()
