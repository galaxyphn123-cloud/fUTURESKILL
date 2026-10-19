/* Registers a new-style domain (src/data/activities/<dir>/index.js) everywhere it must appear:
   domains.js, skillContent.js (content map + skill list), projects.js (one project per domain), then rebuilds the taxonomy.
   node scripts/add-domain.mjs spec.json
   spec: { id:"DEC", dir:"dec", prefix:"DEC", name:"Pengambilan Keputusan", group:"Pikiran Masa Depan", icon:"⇄", color:"amber",
           skills:[{id:"DEC-01",name:"...",file:"dec01",exp:"DEC_01_ACTIVITIES"}...],
           project:{id:"p_dec",title:"...",brief:"...",prompts:["...","...","...","..."]} } */
import fs from "node:fs";
import { execSync } from "node:child_process";
const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const root = new URL("../", import.meta.url).pathname;
const P = spec.prefix, rd = f => fs.readFileSync(root + f, "utf8"), wr = (f, t) => fs.writeFileSync(root + f, t);

const idx = `/* Domain "${spec.name}". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
${spec.skills.map(s => `import { ${s.exp} } from "./${s.file}.js";`).join("\n")}

export const ${P}_DOMAIN_NAME = ${JSON.stringify(spec.name)};
export const ${P}_SKILLS = [
${spec.skills.map(s => `  { id: ${JSON.stringify(s.id)}, name: ${JSON.stringify(s.name)}, activities: ${s.exp} },`).join("\n")}
];
`;
wr(`src/data/activities/${spec.dir}/index.js`, idx);

const imp = `import { ${P}_SKILLS, ${P}_DOMAIN_NAME } from "./activities/${spec.dir}/index.js";`;
let d = rd("src/data/domains.js");
if (!d.includes(imp)) {
  d = d.replace(/(import \{ LHL_SKILLS[^\n]*\n)/, `$1${imp}\n`);
  d = d.replace(/\n\];\n\nexport const PHASES/, `\n  { id: ${JSON.stringify(spec.id)}, group: ${JSON.stringify(spec.group)}, name: ${P}_DOMAIN_NAME, icon: ${JSON.stringify(spec.icon)}, color: COLORS.${spec.color},\n    skills: ${P}_SKILLS.map(s => ({ id: s.id, name: s.name, status: "live" })) },\n];\n\nexport const PHASES`);
  wr("src/data/domains.js", d);
}
let c = rd("src/data/skillContent.js");
if (!c.includes(imp)) {
  c = c.replace(/(import \{ LHL_SKILLS[^\n]*\n)/, `$1${imp}\n`);
  c = c.replace("  ...Object.fromEntries(LHL_SKILLS.map(s => [s.id, s.activities])),", `  ...Object.fromEntries(LHL_SKILLS.map(s => [s.id, s.activities])),\n  ...Object.fromEntries(${P}_SKILLS.map(s => [s.id, s.activities])),`);
  c = c.replace("  ...LHL_SKILLS.map(s => ({ id: s.id, domain: LHL_DOMAIN_NAME, name: s.name })),", `  ...LHL_SKILLS.map(s => ({ id: s.id, domain: LHL_DOMAIN_NAME, name: s.name })),\n  ...${P}_SKILLS.map(s => ({ id: s.id, domain: ${P}_DOMAIN_NAME, name: s.name })),`);
  wr("src/data/skillContent.js", c);
}
let pr = rd("src/data/projects.js");
if (!pr.includes(`id: "${spec.project.id}"`)) {
  const p = spec.project;
  const row = `  { id: ${JSON.stringify(p.id)}, domain: ${JSON.stringify(spec.id)}, icon: ${JSON.stringify(spec.icon)}, title: ${JSON.stringify(p.title)}, brief: ${JSON.stringify(p.brief)},\n    prompts: ${JSON.stringify(p.prompts)} },\n`;
  const i = pr.lastIndexOf("];");
  pr = pr.slice(0, i) + row + pr.slice(i);
  wr("src/data/projects.js", pr);
}
console.log(execSync("node scripts/build-taxonomy.mjs", { cwd: root }).toString());
