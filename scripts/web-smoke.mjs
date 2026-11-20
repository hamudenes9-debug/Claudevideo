// Optional integration test: npm install --no-save @playwright/test @sparticuz/chromium
// Start python3 web/serve.py first, then node scripts/web-smoke.mjs
import { chromium as playwright } from "@playwright/test";
import chromium from "@sparticuz/chromium";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await playwright.launch({
  executablePath: await chromium.executablePath(),
  args: chromium.args,
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    acceptDownloads: true,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000");
  await page.waitForSelector(".scene canvas");
  assert.equal(await page.locator(".scene").count(), 5);
  await page.locator("#brand").fill("TEST STÜDYO");
  await page.locator("#generate").click();
  await page.locator(".scene").nth(1).click();
  await page.locator("#scene-title").fill("Yeni bir başlangıç");
  assert.match(
    await page.locator(".scene.selected").innerText(),
    /Yeni bir başlangıç/,
  );
  const [project] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#save").click(),
  ]);
  assert.equal(await project.failure(), null);
  const saved = JSON.parse(await fs.readFile(await project.path(), "utf8"));
  assert.equal(saved.plan.brand, "TEST STÜDYO");
  await page.locator("#photos").setInputFiles({
    name: "sample.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      await page.evaluate(() => {
        const c = document.createElement("canvas");
        c.width = 800;
        c.height = 600;
        const g = c.getContext("2d");
        g.fillStyle = "#8a967c";
        g.fillRect(0, 0, 800, 600);
        g.fillStyle = "#d3c9a8";
        g.fillRect(450, 0, 350, 600);
        return c.toDataURL("image/png").split(",")[1];
      }),
      "base64",
    ),
  });
  await page.waitForFunction(
    () => document.querySelector("#asset-count").textContent === "1 / 8 görsel",
  );
  await page.locator("#generate").click();
  assert.equal(await page.locator("#scene-photo").inputValue(), "0");
  await fs.mkdir("output/web-test", { recursive: true });
  await page.screenshot({
    path: "output/web-test/desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: "output/web-test/mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator("#duration").selectOption("15");
  // Two seconds of generated PCM audio validates the optional browser audio path.
  const samples = 22050 * 2,
    wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(22050, 24);
  wav.writeUInt32LE(44100, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++)
    wav.writeInt16LE(
      Math.round(Math.sin((i / 22050) * Math.PI * 440 * 2) * 3000),
      44 + i * 2,
    );
  await page
    .locator("#audio")
    .setInputFiles({
      name: "test-tone.wav",
      mimeType: "audio/wav",
      buffer: wav,
    });
  if (await page.locator("#export").isEnabled()) {
    const [video] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }),
      page.locator("#export").click(),
    ]);
    assert.equal(await video.failure(), null);
    const videoPath = await video.path();
    assert.ok((await fs.stat(videoPath)).size > 1000);
    await fs.copyFile(videoPath, "output/web-test/export.video");
  }
  await page.locator(".ai-panel summary").click();
  await page.locator("#api-key").fill("test-not-real");
  await page.route("https://generativelanguage.googleapis.com/**", (route) =>
    route.fulfill({ status: 429, contentType: "application/json", body: "{}" }),
  );
  page.on("dialog", (d) => d.accept());
  await page.locator("#gemini").click();
  await page.waitForFunction(() =>
    document.querySelector("#status").textContent.includes("429"),
  );
  assert.equal(await page.locator("#api-key").inputValue(), "test-not-real");
  await page.unroute("https://generativelanguage.googleapis.com/**");
  const aiPlan = {
    brand: "MODEL TEST",
    scenes: Array.from({ length: 5 }, (_, i) => ({
      title: `Sahne ${i + 1}`,
      subtitle: "Kontrollü plan",
      narration: "Merhaba",
      photo: 0,
    })),
  };
  await page.route("https://generativelanguage.googleapis.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        candidates: [
          { content: { parts: [{ text: JSON.stringify(aiPlan) }] } },
        ],
      }),
    }),
  );
  await page.locator("#gemini").click();
  await page.waitForFunction(
    () => document.querySelector("#brand").value === "MODEL TEST",
  );
  assert.equal(await page.locator("#scene-title").inputValue(), "Sahne 1");
  const [secretFree] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#save").click(),
  ]);
  assert.ok(
    !(await fs.readFile(await secretFree.path(), "utf8")).includes(
      "test-not-real",
    ),
  );
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: scenes, edits, JSON download, photo upload, responsive layout, video export, Gemini error handling, no browser errors.",
  );
} finally {
  await browser.close();
}
