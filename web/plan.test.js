import test from "node:test";
import assert from "node:assert/strict";
import { localPlan, validatePlan, elevenlabsText } from "./plan.js";
test("local plan produces five scenes and maps existing media", () => {
  const p = localPlan("Örnek", "brief", "editorial", 20, "#d5ad72", 2);
  assert.equal(p.scenes.length, 5);
  assert.deepEqual(
    p.scenes.map((s) => s.photo),
    [0, 1, 0, 1, 0],
  );
  assert.equal(p.duration, 20);
});
test("rejects malformed or oversized model plans", () => {
  assert.throws(() => validatePlan({ scenes: [] }));
  const p = localPlan("Örnek", "", "minimal", 15, "#000000", 0);
  p.scenes[0].title = "a".repeat(91);
  assert.throws(() => validatePlan(p));
  p.scenes[0] = null;
  assert.throws(() => validatePlan(p));
});
test("normalizes untrusted selections and never accepts out of range photos", () => {
  const p = localPlan("Örnek", "", "editorial", 20, "#d5ad72", 0);
  p.style = "javascript:alert(1)";
  p.accent = "url(evil)";
  p.duration = 500;
  p.scenes[0].photo = 42;
  const valid = validatePlan(p, 2);
  assert.equal(valid.style, "editorial");
  assert.equal(valid.duration, 20);
  assert.equal(valid.accent, "#d5ad72");
  assert.equal(valid.scenes[0].photo, -1);
});
test("narration export separates instructions and speech", () => {
  assert.match(
    elevenlabsText(localPlan("Örnek", "", "editorial", 20, "#d5ad72", 0)),
    /OKUNACAK METİN/,
  );
});
