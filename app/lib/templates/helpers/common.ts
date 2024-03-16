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
  const lv =
    level.length > 0 && level !== "no_mention"
      ? constr("", "(", level, ")")
      : "";
  return constr(" ", name, lv);
}

export function certificateDisplay(
  { name, issuer, date, url }: CertificateRecord,
  delimiter = "\n"
) {
  const firstLine = [];
  if (name.trim().length) {
    firstLine.push(name);
  }
  if (date.trim().length) {
    firstLine.push(`[${getReadableDateFromPicker(date)}]`);
  }
  const secondLine = constr(" - ", issuer, url);
  return constr(delimiter, firstLine.join(" "), secondLine);
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

export function convertDate(date: string) {
  if (date.trim().length === 0) {
    return "9999-12";
  } else {
    const toks = date.split("/");
    return toks.length === 2 ? `${toks[1]}-${toks[0]}` : `${toks[0]}-01`;
  }
}

export const createTwoDimArray = (
  flatArray: any[],
  numSubArrays: number
): any[][] => {
  const twoDimArray = [];
  const chunkSize = Math.ceil(flatArray.length / numSubArrays);
  for (let i = 0; i < flatArray.length; i += chunkSize) {
    twoDimArray.push(flatArray.slice(i, i + chunkSize));
  }
  return twoDimArray;
};
