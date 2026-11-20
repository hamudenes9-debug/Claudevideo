"""Build a standalone static web app archive, without keys or user media."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib

root = Path(__file__).resolve().parents[1]
out = root / 'dist'
out.mkdir(exist_ok=True)
archive_path = out / 'frame-web-v1.1.0.zip'
allowed = {'.html', '.css', '.js', '.py', '.md'}
with ZipFile(archive_path, 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'web').iterdir()):
        if path.is_file() and path.suffix in allowed and not path.name.endswith('.test.js'):
            archive.write(path, Path('frame-web/web') / path.name)
    archive.write(root / 'LICENSE', 'frame-web/LICENSE')
    archive.write(root / 'WEB_QUICKSTART.md', 'frame-web/BASLANGIC.md')
    archive.writestr('frame-web/BASLAT.bat', '''@echo off
cd /d "%~dp0"
echo Frame Video Atolyesi - http://localhost:3000
echo Sunucu acildiktan sonra tarayicinizda yukaridaki adresi acin.
echo Durdurmak icin Ctrl+C. Bu pencere acik kalmalidir.
where py >nul 2>nul
if %errorlevel% equ 0 (
  py -3 web/serve.py --port 3000
) else (
  python web/serve.py --port 3000
)
echo Python 3 kurulu degilse once Python 3 kurun. Ayrintilar: BASLANGIC.md
pause
'''.replace('\n', '\r\n'))
    archive.writestr('frame-web/baslat.sh', '#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nexec python3 web/serve.py --port 3000\n')
with ZipFile(archive_path) as archive:
    assert 'frame-web/web/index.html' in archive.namelist()
    assert 'frame-web/BASLAT.bat' in archive.namelist()
    assert not any('__pycache__' in name for name in archive.namelist())
(out / 'frame-web-SHA256SUMS.txt').write_text(
    hashlib.sha256(archive_path.read_bytes()).hexdigest() + '  ' + archive_path.name + '\n'
)
print(archive_path)
