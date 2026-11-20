import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('render', ROOT/'skills/claude-video/scripts/render.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

class RenderTests(unittest.TestCase):
    def test_reject_invalid(self):
        for patch in ({'size':[640,480]}, {'fps':0}, {'scenes':[]}, {'scenes':[{'duration':-1}]}, {'scenes':[{'drawing':'unknown'}]}):
            data = {'scenes':[{}], **patch}
            with self.assertRaises(ValueError):
                r.validate(data, ROOT)

    def test_turkish_and_overflow(self):
        data = {'size':[640,360], 'scenes':[{}]}
        self.assertEqual(r.frame(data, {'title':'İı Şş Ğğ Çç Öö Üü'}, ROOT, .5, 0).size, (640,360))
        with self.assertRaises(ValueError):
            r.frame(data, {'title':'W'*200}, ROOT, .5, 0)

    def test_video_photo_logo_audio_and_frames(self):
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory)
            Image.new('RGB',(400,300),'teal').save(base/'photo.png')
            Image.new('RGBA',(80,40),'orange').save(base/'logo.png')
            subprocess.run([r.ffmpeg(),'-v','error','-f','lavfi','-i','sine=frequency=440:duration=0.2',str(base/'voice.wav')],check=True)
            data = {'size':[640,360], 'fps':8,'logo':'logo.png','audio':'voice.wav','scenes':[
                {'duration':.5,'title':'Merhaba','photo':'photo.png'},
                {'duration':.5,'title':'Mekân','drawing':'room'},
                {'duration':.5,'title':'Tasarım'}]}
            (base/'plan.json').write_text(json.dumps(data))
            r.render(base/'plan.json',base/'out')
            self.assertGreater((base/'out/video.mp4').stat().st_size,1000)
            frames = list((base/'out/frames').glob('*.png'))
            self.assertEqual(len(frames),5)
            for path in frames:
                with Image.open(path) as im:
                    self.assertEqual(im.size,(640,360))
            metadata = json.loads((base/'out/manifest.json').read_text())
            self.assertEqual(metadata['duration'],1.5)
            self.assertTrue(metadata['audio_attached'])
            # Decode full result (including AAC) to validate the actual container.
            subprocess.run([r.ffmpeg(),'-v','error','-i',str(base/'out/video.mp4'),'-f','null','-'],check=True)

if __name__ == '__main__':
    unittest.main()
