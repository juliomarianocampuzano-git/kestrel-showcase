import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
test("every downloadable sample matches its declared SHA-256 hash", async () => {
  const dir = new URL("../public/samples/", import.meta.url);
  const manifest = JSON.parse(
    await readFile(new URL("manifest.json", dir), "utf8"),
  );
  assert.equal(manifest.signed, false);
  for (const [name, hash] of Object.entries(manifest.files)) {
    const actual = createHash("sha256")
      .update(await readFile(new URL(name, dir)))
      .digest("hex");
    assert.equal(actual, hash);
  }
});
