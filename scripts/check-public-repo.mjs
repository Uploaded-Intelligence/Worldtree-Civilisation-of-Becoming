import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const forbiddenSnapshotRoots = ["ontology/", "contracts/"];
const conversationMarkers = [
  `<${"in-app-browser-context"}`,
  `<${"user"}>`,
  `<${"assistant"}>`,
  ["Message", "Type:"].join(" "),
];

const secretPatterns = [
  /sk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /gh[oprsu]_[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

export function scanEntry(filePath, content) {
  const normalized = filePath.replaceAll(path.sep, "/").replace(/^\.\//, "");
  const findings = [];

  if (forbiddenSnapshotRoots.some((root) => normalized.startsWith(root))) {
    findings.push(`${normalized}: upstream contract snapshot is forbidden before a released manifest`);
  }

  if (/\/(?:Users|home)\/[A-Za-z0-9._-]+(?:\/|$)/.test(content)) {
    findings.push(`${normalized}: absolute local path exposes workstation metadata`);
  }

  if (/\/(?:private\/(?:tmp|var)|tmp)\/[A-Za-z0-9._/-]+/.test(content)) {
    findings.push(`${normalized}: absolute temporary path exposes workstation metadata`);
  }

  if (secretPatterns.some((pattern) => pattern.test(content))) {
    findings.push(`${normalized}: secret-shaped content is forbidden in public history`);
  }

  if (conversationMarkers.some((marker) => content.includes(marker))) {
    findings.push(`${normalized}: serialized conversation export marker is forbidden`);
  }

  return findings;
}

async function walk(root, relative = "") {
  const directory = path.join(root, relative);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await walk(root, child));
    else if (entry.isFile()) files.push(child);
  }

  return files;
}

export async function scanRepository(root = process.cwd()) {
  const findings = [];

  for (const filePath of await walk(root)) {
    const absolute = path.join(root, filePath);
    const metadata = await stat(absolute);
    if (metadata.size > 2 * 1024 * 1024) {
      findings.push(`${filePath}: file exceeds the 2 MiB public-foundation limit`);
      continue;
    }

    const buffer = await readFile(absolute);
    if (buffer.includes(0)) continue;
    findings.push(...scanEntry(filePath, buffer.toString("utf8")));
  }

  return findings;
}

async function main() {
  const findings = await scanRepository();
  if (findings.length > 0) {
    for (const finding of findings) console.error(`FAIL ${finding}`);
    process.exitCode = 1;
    return;
  }

  console.log("PASS public repository policy scan");
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) await main();
