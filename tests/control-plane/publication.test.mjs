import test from "node:test";
import assert from "node:assert/strict";

import { scanEntry } from "../../scripts/check-public-repo.mjs";

test("accepts ordinary public project documentation", () => {
  assert.deepEqual(
    scanEntry("docs/CONTINUATION.md", "Use $HOME/Documents/Worldtree as the workspace."),
    [],
  );
});

test("rejects absolute local home paths", () => {
  const localPath = ["", "Users", "example", "Documents", "Worldtree"].join("/");
  const findings = scanEntry(
    "docs/CONTINUATION.md",
    localPath,
  );

  assert.match(findings[0], /absolute local path/i);
});

test("rejects secret-shaped content", () => {
  const secret = ["sk", "proj", "abcdefghijklmnopqrstuvwxyz123456"].join("-");
  const findings = scanEntry(
    "docs/example.md",
    `token: ${secret}`,
  );

  assert.match(findings[0], /secret-shaped/i);
});

test("rejects serialized conversation markers", () => {
  const marker = `<${"in-app-browser-context"} source="ambient-ui-state">`;
  const findings = scanEntry(
    "docs/archive.md",
    marker,
  );

  assert.match(findings[0], /conversation export/i);
});

test("rejects ontology or contract snapshots before upstream release", () => {
  const ontology = scanEntry("ontology/v0.1/schema.json", "{}");
  const contract = scanEntry("contracts/upstream/v0.1/schema.json", "{}");

  assert.match(ontology[0], /upstream contract snapshot/i);
  assert.match(contract[0], /upstream contract snapshot/i);
});
