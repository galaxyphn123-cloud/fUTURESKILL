/* Usage: node scripts/normalize-file.mjs <path> <ExportName>
   Rewrites an authored activities file in canonical one-line-per-activity form and rotates each MCQ so the
   right answer sits at position n%3 (even spread; authors never need to place answers by hand). */
import fs from "node:fs";
import path from "node:path";
const [file, exportName] = process.argv.slice(2);
const acts = (await import(path.resolve(file)))[exportName];
const KEYS = ["n", "type", "micro", "q", "options", "items", "groups", "answer", "explain", "hint", "sample"];
const SECTIONS = { 1: "A. FONDASI (1-20)", 21: "B. PEMAHAMAN (21-40)", 41: "C. PENERAPAN (41-60)", 61: "D. PENALARAN (61-80)", 81: "E. TANTANGAN (81-100)" };
let text = `export const ${exportName} = [\n`;
for (const a of acts) {
  const b = { ...a };
  if (a.type === "mcq") {
    const right = a.options[a.answer], rest = a.options.filter((_, i) => i !== a.answer), pos = Math.min(a.n % 3, a.options.length - 1);
    rest.splice(pos, 0, right); b.options = rest; b.answer = pos;
  }
  if (SECTIONS[a.n]) text += `// ===== ${SECTIONS[a.n]} =====\n`;
  text += "{" + KEYS.filter(k => b[k] !== undefined).map(k => `${k}:${JSON.stringify(b[k])}`).join(",") + "},\n";
}
fs.writeFileSync(file, text + "];\n");
console.log("normalized", acts.length);
