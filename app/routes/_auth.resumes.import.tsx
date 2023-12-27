import { NoMemory, extractJson as MyExtractJson } from "@/lib/ai/bot.server";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
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
import { importResume } from "@/lib/resumes.server";
import { defaultResumeValues } from "@/lib/defaults";
import { DASHBOARD } from "@/lib/routes";

export async function action({ request }: ActionFunctionArgs) {
  const posted = Object.fromEntries(await request.formData());

  const resumeText = get(posted, "resumeText", "") as string;
  if (resumeText.trim().length === 0) {
    return redirect(DASHBOARD);
  }

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
  toks.push(resumeText);
  toks.push(
    "You must convert this input to the JSONresume.org format and return that back as a JSON object just like the one I provided you above. Wherever dates appear try to use the MM/YYYY format if possible or YYYY format if month is not available. Here is the your input text:"
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

  const toStore = getResumeValues(extracted);

  const id = await importResume(request, toStore);

  return redirect(`/resumes/${id}/edit`);
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
    firstName: get(data, "basics.firstName", ""),
    lastName: get(data, "basics.lastName", ""),
    email: get(data, "basics.email", ""),
    phone: get(data, "basics.phone", ""),
    location: {
      address: get(data, "basics.location.address", ""),
    },
    url: get(data, "basics.url", ""),
  } satisfies BasicsValues);

  set(output, "resume.summary", {
    asObjective: false,
    content: get(data, "summary.content"),
  } satisfies SummaryValues);

  set(
    output,
    "resume.work",
    map(
      get(data, "work", []),
      (w) =>
        ({
          uuid: v4(),
          name: get(w, "name", ""),
          position: get(w, "position", ""),
          city: get(w, "city", ""),
          state: get(w, "state", ""),
          startDate: get(w, "startDate", ""),
          endDate: get(w, "endDate", ""),
          bullets: map(get(w, "bullets", []), (b) => ({
            uuid: v4(),
            content: get(b, "content", ""),
          })),
        } satisfies WorkRecord)
    )
  );

  set(
    output,
    "resume.education",
    map(
      get(data, "education", []),
      (w) =>
        ({
          uuid: v4(),
          institution: get(w, "institution", ""),
          studyType: get(w, "studyType", ""),
          area: get(w, "area", ""),
          status: get(w, "status", "no_mention"),
          city: get(w, "city", ""),
          state: get(w, "state", ""),
          startDate: get(w, "startDate", ""),
          endDate: get(w, "endDate", ""),
          bullets: map(get(w, "bullets", []), (b) => ({
            uuid: v4(),
            content: get(b, "content", ""),
          })),
        } satisfies EducationRecord)
    )
  );

  set(
    output,
    "resume.certificates",
    map(
      get(data, "certificates", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", ""),
          issuer: get(c, "issuer", ""),
          url: get(c, "url", ""),
          date: get(c, "date", ""),
        } satisfies CertificateRecord)
    )
  );

  set(output, "meta.mode", "custom");
  if (output.resume.certificates.length) {
    output.meta.steps.certificates.enabled = true;
  }

  set(
    output,
    "resume.interests",
    map(
      get(data, "interests", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", ""),
        } satisfies InterestRecord)
    )
  );

  set(
    output,
    "resume.skills",
    map(
      get(data, "skills", []),
      (s) =>
        ({
          uuid: v4(),
          name: get(s, "name", ""),
          level: get(s, "level", ""),
        } satisfies SkillRecord)
    )
  );

  set(
    output,
    "resume.accomplishments",
    map(
      get(data, "accomplishments", []),
      (c) =>
        ({
          uuid: v4(),
          name: get(c, "name", ""),
        } satisfies AccomplishmentRecord)
    )
  );

  if (output.resume.accomplishments.length) {
    output.meta.steps.accomplishments.enabled = true;
  }

  return output;
}
