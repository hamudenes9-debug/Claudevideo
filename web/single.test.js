import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
test("standalone HTML contains CSS, bundled Three.js and license without external dependencies", () => {
  assert.ok(!/<script[^>]+src\s*=/i.test(html));
  assert.ok(!/<link[^>]+rel="stylesheet"/i.test(html));
  assert.match(html, /<style>/);
  assert.match(html, /THREE.JS LICENSE/);
  assert.match(html, /Copyright.*three\.js/);
  assert.match(html, /APPLICATION LICENSE/);
  assert.match(html, /WebGLRenderer/);
});
test("embedded classic script parses without module loader or fetch", () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});
