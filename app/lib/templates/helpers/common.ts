import type { CertificateRecord, SkillRecord } from "@/lib/types";

export function constr(delimiter: string, ...strings: string[]): string {
  return strings.filter((str) => str !== "").join(delimiter);
}

export function skillDisplay({ name, level }: SkillRecord) {
  const lv = level !== 'no_mention' ? constr("", '(', level, ')') : '';
  return constr(" ", name, lv);
}

export function certificateDisplay({ name, issuer, date, url }: CertificateRecord) {
  const firstLine = [];
  if (name.trim().length) {
    firstLine.push(name);
  }
  if (date.trim().length) {
    firstLine.push(`[${date}]`);
  }
  const secondLine = constr(" - ", issuer, url);
  return constr("\n", firstLine.join(" "), secondLine);
}
