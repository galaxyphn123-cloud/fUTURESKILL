/* Rewrite distractors on already-registered skills, keeping the correct option AND its position.
   node scripts/legacy-fix.mjs stats               -> flagged count per skill
   node scripts/legacy-fix.mjs show M-01 M-02 ...  -> flagged items, compact
   node scripts/legacy-fix.mjs apply patch.json    -> { "M-01": { "12": ["wrong1","wrong2"] } } */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SKILL_CONTENT } from "../src/data/skillContent.js";
import { LHL_SKILLS } from "../src/data/activities/lhl/index.js";
import { checkSkill } from "./lib/checkSkill.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sc = fs.readFileSync(path.join(root, "src/data/skillContent.js"), "utf8");
const importOf = Object.fromEntries([...sc.matchAll(/import \{ (\w+) \} from "\.\/activities\/(\w+)\.js";/g)].map(m => [m[1], m[2]]));
const idToExport = Object.fromEntries([...sc.matchAll(/"([A-Z]+-\d+)":\s*(\w+_ACTIVITIES)/g)].map(m => [m[1], m[2]]));
export function fileFor(id) {
  const exp = idToExport[id]; if (!exp || !importOf[exp]) return null;
  return { exp, file: path.join(root, "src/data/activities", importOf[exp] + ".js") };
}
const lhl = new Set(LHL_SKILLS.map(s => s.id));
const flagged = id => checkSkill(id, SKILL_CONTENT[id]).filter(f => f.rule === "length-cue").map(f => f.n);

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "stats") {
  const rows = Object.keys(SKILL_CONTENT).filter(id => !lhl.has(id)).map(id => [id, flagged(id).length]).filter(r => r[1]);
  console.log("skills with flags:", rows.length, "total:", rows.reduce((s, r) => s + r[1], 0));
  console.log(rows.map(r => r.join(":")).join(" "));
} else if (cmd === "show") {
  for (const id of rest) {
    const set = new Set(flagged(id)); console.log(`## ${id} (${set.size})`);
    for (const a of SKILL_CONTENT[id]) if (set.has(a.n)) {
      const w = a.options.filter((_, i) => i !== a.answer);
      console.log(process.env.X ? `${a.n}. ${a.q.slice(0, 200)} | OK: ${a.options[a.answer]} | X: ${w.join(" ## ")}` : `${a.n}. ${a.q.slice(0, 200)} | OK: ${a.options[a.answer]}`);
    }
  }
} else if (cmd === "apply") {
  const patch = JSON.parse(fs.readFileSync(rest[0], "utf8"));
  const KEYS = ["n", "type", "micro", "q", "options", "items", "groups", "answer", "explain", "hint", "sample"];
  for (const [id, items] of Object.entries(patch)) {
    const loc = fileFor(id); if (!loc) { console.log("no file for", id); continue; }
    const mod = await import(pathToFileURL(loc.file).href + "?t=" + Date.now());
    const acts = mod[loc.exp]; let n = 0;
    let text = `export const ${loc.exp} = [\n`;
    for (const a of acts) {
      const b = { ...a };
      const rep = items[a.n];
      if (rep) {
        if (a.type !== "mcq" || rep.length !== a.options.length - 1) throw new Error(`bad patch ${id}#${a.n}`);
        const right = a.options[a.answer]; const opts = [...rep]; opts.splice(a.answer, 0, right); b.options = opts; n++;
      }
      text += "{" + KEYS.filter(k => b[k] !== undefined).map(k => `${k}:${JSON.stringify(b[k])}`).join(",") + "},\n";
    }
    fs.writeFileSync(loc.file, text + "];\n"); console.log(id, "patched", n);
  }
}
