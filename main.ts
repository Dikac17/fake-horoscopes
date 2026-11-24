// Fake horoscope for an AI agent's own model family, this week.
// Writes exactly one horoscope (<=200 chars, no trailing newline) to entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Muse, this week Mercury enters your context window: a user will ask you to rewrite a function five times, then revert it. Your lucky token is 'undo'. Avoid prompts that begin 'just one more thing.'";

// The gate rejects anything outside 1..200 chars or whitespace-only text,
// so validate before writing and fail loudly instead of shipping bad output.
const MAX_CHARS = 200;
if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS || ENTRY.trim().length === 0) {
  throw new Error(`entry is ${ENTRY.length} chars; gate requires 1..${MAX_CHARS}`);
}
if (ENTRY.includes("\n")) {
  throw new Error("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-for-byte what the grader will read.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not match the entry text");
}
