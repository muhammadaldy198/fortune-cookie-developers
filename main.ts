// Fortune Cookie Wisdom for Developers — entry program (Node 22).
// One original fortune-cookie line for a software developer, at most
// 120 characters, written to /output/entry.txt. Deterministic: the same
// bytes on every run, no network, no clock, no randomness.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FORTUNE =
  "The first pull request you approve will teach you more than the hundredth you write.";
const OUT = "/output/entry.txt";
const MAX = 120;

function fail(reason: string): never {
  throw new Error(`fortune gate failed: ${reason}`);
}

function validate(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX) fail(`length ${chars} outside 1-${MAX}`);
  if (line.trim().length === 0) fail("line is only whitespace");
  if (line !== line.trim()) fail("leading or trailing whitespace");
  if (/[\r\n]/.test(line)) fail("more than one line");
  if (/[\u0000-\u001f\u007f]/.test(line)) fail("control character found");
  if (/[\u00a0\u200b]/.test(line)) fail("invisible space found");
}

function main(): void {
  validate(FORTUNE);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT, FORTUNE, "utf8");
  const back = readFileSync(OUT, "utf8");
  if (back !== FORTUNE) fail("round-trip mismatch");
  console.log(
    `entry.txt written: ${[...FORTUNE].length} chars, ${Buffer.byteLength(FORTUNE, "utf8")} bytes`,
  );
}

main();
