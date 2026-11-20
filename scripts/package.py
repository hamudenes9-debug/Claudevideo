"""Build installable skill and demo ZIPs; run from repository root."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import re

root = Path(__file__).resolve().parents[1]
out = root/'dist'
out.mkdir(exist_ok=True)
skill = root/'skills/brand-video'
metadata = (skill/'SKILL.md').read_text(encoding='utf-8').split('---', 2)[1]
match = re.search(r'^name: ([a-z0-9-]+)$', metadata, re.MULTILINE)
if not match or len(match[1]) > 64 or any(word in match[1] for word in ('claude', 'anthropic')):
    raise ValueError('Invalid or reserved skill name in SKILL.md')
if match[1] != skill.name:
    raise ValueError('Skill folder and frontmatter name must match')
with ZipFile(out/'brand-video-v1.0.1.zip','w',ZIP_DEFLATED) as archive:
    for path in sorted(skill.rglob('*')):
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc':
            archive.write(path, Path('brand-video')/path.relative_to(skill))
demo = root/'output/demo'
if demo.is_dir():
    with ZipFile(out/'brand-video-demo-v1.0.1.zip','w',ZIP_DEFLATED) as archive:
        for path in sorted(demo.rglob('*')):
            if path.is_file():
                archive.write(path, Path('demo')/path.relative_to(demo))
with (out/'SHA256SUMS.txt').open('w') as checksums:
    for path in sorted(out.glob('*v1.0.1.zip')):
        checksums.write(hashlib.sha256(path.read_bytes()).hexdigest()+'  '+path.name+'\n')
print('Release assets:', out)
