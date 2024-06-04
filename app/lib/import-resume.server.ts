import { NoMemory, extractJson as MyExtractJson } from "@/lib/ai/bot.server";
import { get, map, set } from "lodash-es";
import chalk from "chalk";
import type {
  AccomplishmentRecord,
  BasicsValues,
  CertificateRecord,
  EducationRecord,
  InterestRecord,
  SkillRecord,
  SummaryValues,
  WorkRecord,
} from "@/lib/types";
import { extractJson } from "crack-json";
import { v4 } from "uuid";
import { defaultResumeValues } from "@/lib/defaults";
import { constr } from "./templates/helpers/common";

export async function parseText(text: string) {
  const bot = new NoMemory(0.2);
  const toks = [];

  toks.push(
    "You are a text parser with the task of taking as input unstructured pieces of text from resumes and converting them to JSON objects structured according the jsonresume.org format so that these can be later analyzed and stored in a database. The following JSON ojbect is an example of the desired output:"
  );
  toks.push(`
{
    basics: {
      firstName: "John",
      lastName: "Lennon",
      email: "jlennon@gmail.com",
      location: {
        address: "2712 Broadway St, San Fransisco, CA 94115, USA",
      }
      phone: "9125554321",
      url: "https://linkein.com/jlennon",
    },
    work: [
      {
        name: "coca-cola",
        position: "Senior Engineer",
        city: "Los Angeles",
        state: "CA",
        startDate: "12/2021",
        endDate: "Present",
        bullets: [
          {
            content: "Assisted in the development of this product",
          },
        ],
      },
      {
        name: "Band of America",
        position: "Web Engineer",
        city: "Palo Alto",
        state: "CA",
        startDate: "12/2017",
        endDate: "03/2020",
        bullets: [
          {
            content: "Assisted in the development of this product",
          },
        ],
      },
      {
        name: "Ban of England",
        position: "Web Engineer",
        city: "Palo Alto",
        state: "CA",
        startDate: "12/2007",
        endDate: "03/2010",
        bullets: [
          {
            content: "Assisted in the development of this product",
          },
        ],
      },
      {
        name: "ACS Courier",
        position: "Developer",
        city: "Palo Alto",
        state: "CA",
        startDate: "12/2007",
        endDate: "03/2010",
        bullets: [
          {
            content: "Assisted in the development of this product",
          },
        ],
      },
    ],
    education: [
      {
        institution: "Univeristy of Patras",
        studyType: "Bachelor",
        area: "Computer science",
        city: "Athens",
        state: "AL",
        startDate: "09/1999",
        endDate: "10/2004",
        status: "graduated, ongoing or anticipated",
        bullets: [
          {
            content: "Assisted in the development of this product",
          },
        ],
      },
    ],
    skills: [
      {
        name: "Object oriented programming",
        level: "expert"
      },
      {
        name: "SQL Database",
        level: "beginner"
      },
      {
        name: "Java",
        level: "advanced"
      },
      {
        name: "Creative thinking",
        level: "no_mention"
      },
    ],
    certificates: [
      {
        name: "Certified ScrumMaster (CSM)",
        issuer: "AWS Services",
        date: "12/2022"
      },
    ],
    interests: [
      {
        name: "Gardening",
      },
    ],
    accomplishments: [
      {
        name: "Developed a personal finance tracking app using React Native (Available on GitHub).",
      },
    ],
    summary: {
      content:
        "Highly skilled and motivated software developer with 5 years of experience in full-stack web development. Seeking a challenging position to leverage my expertise in JavaScript, Python, and web technologies to contribute to innovative software solutions at XYZ Software Company.",
    },
  }\r\r`);

  toks.push("The following text is your unstructured input: ");
  toks.push(text);
  toks.push(
    "You must convert this input to the JSONresume.org format and return that back as a JSON object just like the one I provided you above. The work and education sections may contain several entries and you should parse them all. Wherever dates appear try to use the MM/YYYY format if possible or YYYY format if month is not available. Here is the your input text:"
  );
  const response = await bot.send(toks.join(""));
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let extracted: any;
  try {
    extracted = JSON.parse(MyExtractJson(response));
  } catch (e) {
    console.error(chalk.red(e));
    extracted = extractJson(response)[0];
  }

  return getResumeValues(extracted);
}

function mapMonthWordToNumber(word: string) {
  switch (word.toLowerCase()) {
    case "january":
    case "jan":
    case "1":
      return "01";
    case "february":
    case "feb":
    case "2":
      return "02";
    case "march":
    case "mar":
    case "3":
      return "03";
    case "april":
    case "apr":
    case "4":
      return "04";
    case "may":
    case "5":
      return "05";
    case "june":
    case "jun":
    case "6":
      return "06";
    case "july":
    case "jul":
    case "7":
      return "07";
    case "august":
    case "aug":
    case "8":
      return "08";
    case "september":
    case "sep":
    case "9":
      return "09";
    case "october":
    case "oct":
      return "10";
    case "november":
    case "nov":
      return "11";
    case "december":
    case "dec":
      return "12";
    default:
      return word;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getResumeValues(data: any) {
  const output = defaultResumeValues(
    {
      firstName: "",
      lastName: "",
      email: "",
    },
    "en"
  );

  set(output, "resume.basics", {
    firstName: get(data, "basics.firstName", "") || "",
    lastName: get(data, "basics.lastName", "") || "",
    email: get(data, "basics.email", "") || "",
    phone: get(data, "basics.phone", "") || "",
    location: {
      address: get(data, "basics.location.address", "") || "",
    },
    url: get(data, "basics.url", "") || "",
  } satisfies BasicsValues);

  set(output, "resume.summary", {
    asObjective: false,
    content: get(data, "summary.content", "") || "",
  } satisfies SummaryValues);

  set(
    output,
    "resume.work",
    map(get(data, "work", []), (w) => {
      const startDate = get(w, "startDate") || "";
      const endDate: string | undefined = get(w, "endDate");

      let startMonth = "-";
      let startYear = "-";
      let endMonth = "-";
      let endYear = "-";
      let toPresent = false;
      let toks = startDate.split(/[/\-\s]+/);
      if (toks.length === 1) {
        startYear = toks[0];
      } else if (toks.length === 2) {
        startMonth = mapMonthWordToNumber(toks[0]);
        startYear = toks[1];
      }
      toks = endDate ? endDate.split(/[\/\-\s]+/) : [];
      if (toks.length === 1) {
        endYear = toks[0];
      } else if (toks.length === 2) {
        endMonth = mapMonthWordToNumber(toks[0]);
        endYear = toks[1];
      } else {
        if (startDate.length) {
          toPresent = true;
        }
      }

      if (startYear && startYear.length && startYear !== "-") {
        if (+startYear < 50) {
          startYear = (+startYear + 2000).toString();
        } else if (+startYear < 100) {
          startYear = (+startYear + 1900).toString();
        }
      }
      if (endYear && endYear.length && endYear !== "-") {
        if (+endYear < 50) {
          endYear = (+endYear + 2000).toString();
        } else if (+endYear < 100) {
          endYear = (+endYear + 1900).toString();
        }
      }

      return {
        uuid: v4(),
        name: get(w, "name", "") || "",
        position: get(w, "position", "") || "",
        city: constr(", ", get(w, "city", ""), get(w, "state", "")),
        state: "",
        startDate,
        endDate: endDate || "",
        startMonth,
        startYear,
        endYear,
        endMonth,
        toPresent,
        bullets: map(get(w, "bullets", []), (b) => ({
          uuid: v4(),
          content: get(b, "content", ""),
        })),
      } satisfies WorkRecord;
    })
  );

  set(
    output,
    "resume.education",
    map(get(data, "education", []), (w) => {
      const startDate = get(w, "startDate") || "";
      const endDate: string | undefined = get(w, "endDate");

      let startMonth = "-";
      let startYear = "-";
      let endMonth = "-";
      let endYear = "-";
      let toPresent = false;
      let toks = startDate.split(/[/\-\s]+/);
      if (toks.length === 1) {
        startYear = toks[0];
      } else if (toks.length === 2) {
        startMonth = mapMonthWordToNumber(toks[0]);
        startYear = toks[1];
      }
      toks = endDate ? endDate.split(/[/\-\s]+/) : [];
      if (toks.length === 1) {
        endYear = toks[0];
      } else if (toks.length === 2) {
        endMonth = mapMonthWordToNumber(toks[0]);
        endYear = toks[1];
      } else {
        if (startDate.length) {
          toPresent = true;
        }
      }

      if (startYear && startYear.length && startYear !== "-") {
        if (+startYear < 50) {
          startYear = (+startYear + 2000).toString();
        } else if (+startYear < 100) {
          startYear = (+startYear + 1900).toString();
        }
      }
      if (endYear && endYear.length && endYear !== "-") {
        if (+endYear < 50) {
          endYear = (+endYear + 2000).toString();
        } else if (+endYear < 100) {
          endYear = (+endYear + 1900).toString();
        }
      }

      return {
        uuid: v4(),
        institution: get(w, "institution", "") || "",
        studyType: get(w, "studyType", "") || "",
        area: get(w, "area", "") || "",
        status: get(w, "status", "no_mention") || "",
        city: constr(", ", get(w, "city", ""), get(w, "state", "")),
        state: "",
        startDate,
        endDate: endDate || "",
        startMonth,
        startYear,
        endYear,
        endMonth,
        toPresent,
        bullets: map(get(w, "bullets", []), (b) => ({
          uuid: v4(),
          content: get(b, "content", ""),
        })),
      } satisfies EducationRecord;
    })
  );

  set(
    output,
    "resume.certificates",
    map(
      get(data, "certificates", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", "") || "",
          issuer: get(c, "issuer", "") || "",
          url: get(c, "url", "") || "",
          date: get(c, "date", "") || "",
        } satisfies CertificateRecord)
    )
  );

  set(output, "meta.mode", "custom");
  output.meta.steps.certificates.enabled =
    output.resume.certificates.length > 0;

  set(
    output,
    "resume.interests",
    map(
      get(data, "interests", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", "") || "",
        } satisfies InterestRecord)
    )
  );
  output.meta.steps.interests.enabled = output.resume.interests.length > 0;

  set(
    output,
    "resume.skills",
    map(
      get(data, "skills", []),
      (s) =>
        ({
          uuid: v4(),
          name: get(s, "name", "") || "",
          level: get(s, "level", "no_mention") || "no_mention",
        } satisfies SkillRecord)
    )
  );
  output.meta.steps.skills.enabled = output.resume.skills.length > 0;

  set(
    output,
    "resume.accomplishments",
    map(
      get(data, "accomplishments", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", "") || "",
        } satisfies AccomplishmentRecord)
    )
  );
  output.meta.steps.accomplishments.enabled =
    output.resume.accomplishments.length > 0;

  return output;
}
