/* Usage: node scripts/patch-distractors.mjs <path> <ExportName> <patch.json>
   patch.json: { "<n>": ["new distractor 1", "new distractor 2", ...] } — replaces every non-correct option of
   that MCQ (the correct option is kept). Run normalize-file afterwards to rotate answer positions. */
import fs from "node:fs";
import path from "node:path";
const [file, exportName, patchFile] = process.argv.slice(2);
const acts = (await import(path.resolve(file)))[exportName];
const patch = JSON.parse(fs.readFileSync(patchFile, "utf8"));
const KEYS = ["n", "type", "micro", "q", "options", "items", "groups", "answer", "explain", "hint", "sample"];
let text = `export const ${exportName} = [\n`, applied = 0;
for (const a of acts) {
  const b = { ...a };
  if (patch[a.n]) {
    if (a.type !== "mcq" || patch[a.n].length !== a.options.length - 1) throw new Error(`bad patch for #${a.n}`);
    b.options = [a.options[a.answer], ...patch[a.n]]; b.answer = 0; applied++;
  }
  text += "{" + KEYS.filter(k => b[k] !== undefined).map(k => `${k}:${JSON.stringify(b[k])}`).join(",") + "},\n";
}
fs.writeFileSync(file, text + "];\n"); console.log("patched", applied);
