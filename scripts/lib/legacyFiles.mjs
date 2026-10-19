/* Maps a registered skill id (e.g. "FIN-02") to its activity file and export name. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const sc = fs.readFileSync(path.join(root, "src/data/skillContent.js"), "utf8");
const importOf = Object.fromEntries([...sc.matchAll(/import \{ (\w+) \} from "\.\/activities\/(\w+)\.js";/g)].map(m => [m[1], m[2]]));
const idToExport = Object.fromEntries([...sc.matchAll(/"([A-Z]+-\d+)":\s*(\w+_ACTIVITIES)/g)].map(m => [m[1], m[2]]));
// New-style domains (lhl/, sys/, ...) list their skills in src/data/activities/<dir>/index.js.
const sub = {};
const actDir = path.join(root, "src/data/activities");
for (const d of fs.readdirSync(actDir, { withFileTypes: true })) {
  const idx = path.join(actDir, d.name, "index.js");
  if (!d.isDirectory() || !fs.existsSync(idx)) continue;
  const t = fs.readFileSync(idx, "utf8");
  const imp = Object.fromEntries([...t.matchAll(/import \{ (\w+) \} from "\.\/(\w+)\.js";/g)].map(m => [m[1], m[2]]));
  for (const m of t.matchAll(/id: "([A-Z]+-\d+)",[^}]*activities: (\w+)/g)) if (imp[m[2]]) sub[m[1]] = { exp: m[2], file: path.join(actDir, d.name, imp[m[2]] + ".js") };
}
export function fileFor(id) {
  if (sub[id]) return sub[id];
  const exp = idToExport[id]; if (!exp || !importOf[exp]) return null;
  return { exp, file: path.join(root, "src/data/activities", importOf[exp] + ".js") };
}
