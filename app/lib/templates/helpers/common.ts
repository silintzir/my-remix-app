import type {
  AccomplishmentRecord,
  CertificateRecord,
  EducationRecord,
  InterestRecord,
  SkillRecord,
  WorkRecord,
} from "@/lib/types";
import { getReadableDateFromPicker } from "@/lib/utils";
import { filter } from "lodash-es";

export function constr(delimiter: string, ...strings: string[]): string {
  return strings.filter((str) => str !== "").join(delimiter);
}

export function skillDisplay({ name, level }: SkillRecord) {
  const lv = level !== "no_mention" ? constr("", "(", level, ")") : "";
  return constr(" ", name, lv);
}

export function certificateDisplay({
  name,
  issuer,
  date,
  url,
}: CertificateRecord) {
  const firstLine = [];
  if (name.trim().length) {
    firstLine.push(name);
  }
  if (date.trim().length) {
    firstLine.push(`[${getReadableDateFromPicker(date)}]`);
  }
  const secondLine = constr(" - ", issuer, url);
  return constr("\n", firstLine.join(" "), secondLine);
}

export const nonEmptyCertificates = (records: CertificateRecord[]) => {
  return filter(
    records,
    (c) => [c.name, " ", c.issuer].join("").trim().length > 0
  );
};

export const nonEmptyWork = (records: WorkRecord[]) => {
  return filter(
    records,
    (c) => [c.name, " ", c.position].join("").trim().length > 0
  );
};

export const nonEmptyEducation = (records: EducationRecord[]) => {
  return filter(
    records,
    (c) => [c.area, " ", c.institution].join("").trim().length > 0
  );
};

export const nonEmptySkills = (records: SkillRecord[]) => {
  return filter(records, (c) => c.name.trim().length > 0);
};

export const nonEmptyAccomplishments = (records: AccomplishmentRecord[]) => {
  return filter(records, (c) => c.name.trim().length > 0);
};

export const nonEmptyInterests = (records: InterestRecord[]) => {
  return filter(records, (c) => c.name.trim().length > 0);
};
