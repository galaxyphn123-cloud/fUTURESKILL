/* Maps a registered skill id (e.g. "FIN-02") to its activity file and export name. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../..", import.meta.url).pathname);
const sc = fs.readFileSync(path.join(root, "src/data/skillContent.js"), "utf8");
const importOf = Object.fromEntries([...sc.matchAll(/import \{ (\w+) \} from "\.\/activities\/(\w+)\.js";/g)].map(m => [m[1], m[2]]));
const idToExport = Object.fromEntries([...sc.matchAll(/"([A-Z]+-\d+)":\s*(\w+_ACTIVITIES)/g)].map(m => [m[1], m[2]]));
export function fileFor(id) {
  const exp = idToExport[id]; if (!exp || !importOf[exp]) return null;
  return { exp, file: path.join(root, "src/data/activities", importOf[exp] + ".js") };
}
