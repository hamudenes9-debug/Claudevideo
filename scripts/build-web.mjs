import { build } from "esbuild";
import fs from "node:fs/promises";
const result = await build({
  entryPoints: ["web/app.js"],
  bundle: true,
  format: "iife",
  target: ["es2020"],
  minify: true,
  write: false,
  legalComments: "inline",
});
const css = await fs.readFile("web/style.css", "utf8");
const template = await fs.readFile("web/template.html", "utf8");
const license = await fs.readFile("node_modules/three/LICENSE", "utf8");
const appLicense = await fs.readFile("LICENSE", "utf8");
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const html = template
  .replace(
    /<link rel="stylesheet" href="style.css"\s*\/?\s*>/,
    () => `<style>${css}</style>`,
  )
  .replace(
    '<script type="module" src="app.js"></script>',
    () =>
      `<script>\n/* THREE.JS LICENSE\n${license}\nAPPLICATION LICENSE\n${appLicense}\n*/\n${js}\n</script>`,
  )
  .replace(/[\t ]+$/gm, "");
if (/<script[^>]+src=|<link[^>]+rel="stylesheet"/.test(html))
  throw new Error("External runtime dependency found");
await fs.writeFile("web/index.html", html);
await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/frame-three-v1.2.0.html", html);
console.log(
  `Built self-contained HTML: ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`,
);
