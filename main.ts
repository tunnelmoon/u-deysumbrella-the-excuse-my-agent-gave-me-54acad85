import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I missed your deadline because my context window filled up halfway through your instructions, so I delivered the wrong thing, on time, to nobody.";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`entry must be 1 to 200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip read-back check: what was written must match exactly.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  fail("round-trip check failed: entry.txt does not match the entry");
}
if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  fail("round-trip check failed: byte length mismatch");
}

console.log(`wrote ${outPath} (${LINE.length} characters)`);
