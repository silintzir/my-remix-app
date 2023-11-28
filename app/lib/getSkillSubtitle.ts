import type { SkillRecord } from "./types";


export function getSkillSubtitle(values: SkillRecord) {
  const toks = [];
  if (values.level && values.level !== "no_mention") {
    toks.push(values.level);
  }
  return toks.length ? toks.join(" / ") : null;
}

