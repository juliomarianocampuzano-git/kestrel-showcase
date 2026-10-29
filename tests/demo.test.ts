import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sampleTools,
  sampleEmployees,
  summarize,
  validateImport,
} from "../src/lib/demo.ts";
test("seed has exactly 14 tools, 23 fictional employees and coherent counts", () => {
  assert.equal(sampleTools.length, 14);
  assert.equal(sampleEmployees.length, 23);
  assert.equal(sampleEmployees.filter((e) => e.completed).length, 18);
  assert.deepEqual(summarize(sampleTools), {
    total: 14,
    reviewed: 11,
    low: 8,
    transparency: 5,
    review: 1,
  });
  assert.equal(new Set(sampleTools.map((t) => t.id)).size, 14);
});
test("CSV import rejects missing ownership and marks valid tools for review", () => {
  assert.equal(validateImport([{ name: "X" }]).errors.length, 1);
  const r = validateImport([
    { name: " Sample ", owner: " Alex ", purpose: " Test " },
  ]);
  assert.equal(r.errors.length, 0);
  assert.equal(r.tools[0].name, "Sample");
  assert.equal(r.tools[0].status, "Needs review");
  assert.equal(r.tools[0].risk, "Review");
});
test("CSV import bounds row count", () => {
  assert.equal(
    validateImport(
      Array.from({ length: 501 }, () => ({
        name: "X",
        owner: "Y",
        purpose: "Z",
      })),
    ).tools.length,
    0,
  );
});
