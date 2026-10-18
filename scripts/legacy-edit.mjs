/* Field-level editor for registered legacy skills (distractor-only edits live in legacy-fix.mjs).
   node scripts/legacy-edit.mjs show <rule,rule,...> ID [ID...]  -> flagged items in full (options indexed, * = correct)
   node scripts/legacy-edit.mjs apply spec.json                  -> { "FIN-02": { "39": { "q": "...", "hint": "...", "explain": "...", "options": { "1": "new text" } } } }
   The answer index never changes; only text fields listed above can be replaced. */
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { SKILL_CONTENT } from "../src/data/skillContent.js";
import { checkSkill } from "./lib/checkSkill.mjs";
import { fileFor } from "./lib/legacyFiles.mjs";

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "show") {
  const rules = new Set(rest[0].split(","));
  for (const id of rest.slice(1)) {
    const by = {};
    for (const f of checkSkill(id, SKILL_CONTENT[id])) if (rules.has(f.rule)) (by[f.n] ||= []).push(f.rule);
    console.log(`## ${id} (${Object.keys(by).length})`);
    for (const a of SKILL_CONTENT[id]) if (by[a.n]) {
      console.log(`${a.n}. [${by[a.n].join(",")}] Q(${a.q.length}): ${a.q}`);
      if (a.type === "mcq") a.options.forEach((o, i) => console.log(`   ${i === a.answer ? "*" : " "}${i} (${o.length}) ${o}`));
      if (by[a.n].includes("hint-leak")) console.log(`   hint: ${a.hint}`);
    }
  }
} else if (cmd === "apply") {
  const spec = JSON.parse(fs.readFileSync(rest[0], "utf8"));
  const KEYS = ["n", "type", "micro", "q", "options", "items", "groups", "answer", "explain", "hint", "sample"];
  for (const [id, items] of Object.entries(spec)) {
    const loc = fileFor(id); if (!loc) { console.log("no file for", id); continue; }
    const mod = await import(pathToFileURL(loc.file).href + "?t=" + Date.now());
    const acts = mod[loc.exp]; let n = 0, text = `export const ${loc.exp} = [\n`;
    for (const a of acts) {
      const b = { ...a }, e = items[a.n];
      if (e) {
        for (const k of Object.keys(e)) if (!["q", "hint", "explain", "options"].includes(k)) throw new Error(`bad field ${k} ${id}#${a.n}`);
        for (const k of ["q", "hint", "explain"]) if (e[k] !== undefined) b[k] = e[k];
        if (e.options) { if (a.type !== "mcq") throw new Error(`not mcq ${id}#${a.n}`); b.options = [...a.options]; for (const [i, t] of Object.entries(e.options)) { if (!(i in a.options)) throw new Error(`bad index ${id}#${a.n}`); b.options[+i] = t; } }
        n++;
      }
      text += "{" + KEYS.filter(k => b[k] !== undefined).map(k => `${k}:${JSON.stringify(b[k])}`).join(",") + "},\n";
    }
    fs.writeFileSync(loc.file, text + "];\n"); console.log(id, "edited", n);
  }
}
