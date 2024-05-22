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

export const TITLE = {
  OBJECTIVE: "Objective",
  COMPANY_NAME: "Marathon Staffing",
  CONFIDENTIALITY_INFO:
    "Confidential document, not for distribution without prior permission.",
  CONFIDENTIALITY_INFO_LBR:
    "Confidential document,\nnot for distribution without prior permission.",
};

export function constr(delimiter: string, ...strings: string[]): string {
  return strings.filter((str) => str.trim() !== "").join(delimiter);
}

export function skillDisplay({ name, level }: SkillRecord) {
  const lv =
    level.length > 0 && level !== "no_mention"
      ? constr("", "(", level, ")")
      : "";
  return constr(" ", name, lv);
}

export function certificateDisplay2({ name, issuer, date }: CertificateRecord) {
  const toks = [];
  toks.push(name);
  if (issuer.length) {
    toks.push(`by ${issuer}`);
  }
  if (date.length) {
    toks.push(`(${date})`);
  }
  return toks.join(" ");
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

export function getComparableEndDate(values: {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  toPresent?: boolean;
}) {
  const { startYear, startMonth, endMonth, endYear, toPresent } = values;

  if (toPresent) {
    return "9999-12";
  }

  const from = [];
  let start = "0001-01";
  if (startYear?.length && startYear !== "-") {
    from.push(startYear);
    if (startMonth?.length && startMonth !== "-") {
      from.push(startMonth);
    }
  }
  if (from.length) {
    start = from.join("-");
  }

  const to = [];
  if (endYear?.length && endYear !== "-") {
    to.push(endYear);
    if (endMonth?.length && endMonth !== "-") {
      to.push(endMonth);
    }
  }
  if (to.length) {
    return to.join("-");
  }
  return start;
}

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

export const splitArrayByLimit = (
  flatArray: string[],
  limit: number,
  overhead = 3
) => {
  const twoDimArray: string[][] = [];
  let currentArray: string[] = [];
  let currentLength = 0;

  for (const str of flatArray) {
    if (currentLength + str.length <= limit) {
      currentArray.push(str);
      currentLength += str.length + overhead;
    } else {
      twoDimArray.push(currentArray);
      currentArray = [str];
      currentLength = str.length;
    }
  }

  if (currentArray.length > 0) {
    twoDimArray.push(currentArray);
  }

  return twoDimArray;
};
