/* Usage: node scripts/check-file.mjs <path-to-activities.js> <ExportName>
   Validates one authored skill file before it is registered. Exit 1 on any hard flag. */
import path from "node:path";
import { checkSkill, statsFor } from "./lib/checkSkill.mjs";
const [file, exportName] = process.argv.slice(2);
const acts = (await import(path.resolve(file)))[exportName];
if (!acts) { console.error("export not found:", exportName); process.exit(2); }
const flags = checkSkill(exportName, acts);
const stats = statsFor(acts);
console.log(JSON.stringify(stats));
if (stats.longestAnswerShare > 45) console.log(`WARN correct option is the longest in ${stats.longestAnswerShare}% of MCQs (chance ≈ 33%); lengthen some distractors`);
const soft = new Set(["option-long", "too-long"]);
flags.forEach(f => console.log(soft.has(f.rule) ? "WARN" : "FAIL", `#${f.n}`, f.rule, f.detail));
process.exit(flags.some(f => !soft.has(f.rule)) ? 1 : 0);
