"""Build installable skill and demo ZIPs; run from repository root."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parents[1]
out = root/'dist'
out.mkdir(exist_ok=True)
skill = root/'skills/claude-video'
with ZipFile(out/'claude-video-v1.0.0.zip','w',ZIP_DEFLATED) as archive:
    for path in sorted(skill.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc':
            archive.write(path, Path('claude-video')/path.relative_to(skill))
demo = root/'output/demo'
if demo.is_dir():
    with ZipFile(out/'claude-video-demo-v1.0.0.zip','w',ZIP_DEFLATED) as archive:
        for path in sorted(demo.rglob('*')):
            if path.is_file():
                archive.write(path, Path('demo')/path.relative_to(demo))
with (out/'SHA256SUMS.txt').open('w') as checksums:
    for path in sorted(out.glob('*v1.0.0.zip')):
        checksums.write(hashlib.sha256(path.read_bytes()).hexdigest()+'  '+path.name+'\n')
print('Release assets:', out)
