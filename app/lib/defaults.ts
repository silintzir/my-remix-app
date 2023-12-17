import type { AuthValues } from "@/sessions";
import type { ResumeValues, Step } from "./types";

export const DEFAULT_RESUME_TITLE = "Untitled resume";

export const DEFAULT_SECTION_TITLES: Record<Step, string> = {
  start: "Start",
  basics: "Basic info",
  work: "Experience",
  education: "Education",
  skills: "Skills",
  accomplishments: "Accomplishments",
  certificates: "Certificates",
  interests: "Interests",
  summary: "Summary",
  tailor: "Job tailor",
  finish: "Finish",
};

export const DEFAULT_STEPS: Step[] = [
  "start",
  "basics",
  "work",
  "education",
  "skills",
  "interests",
  "summary",
  "finish",
];

export const defaultResumeValues = (
  user: Pick<AuthValues, "firstName" | "lastName" | "email">
): ResumeValues => ({
  meta: {
    title: DEFAULT_RESUME_TITLE,
    language: "en",
    mode: "standard",
    tailor: { content: "", suggestions: {} },
    order: [
      "basics",
      "work",
      "education",
      "skills",
      "certificates",
      "accomplishments",
      "interests",
      "summary",
    ],
    autoSort: {
      education: false,
      work: false,
      certificates: false,
    },
    steps: {
      start: { title: DEFAULT_SECTION_TITLES.start, enabled: true },
      basics: { title: DEFAULT_SECTION_TITLES.basics, enabled: true },
      work: { title: DEFAULT_SECTION_TITLES.work, enabled: true },
      education: { title: DEFAULT_SECTION_TITLES.education, enabled: true },
      skills: { title: DEFAULT_SECTION_TITLES.skills, enabled: true },
      certificates: {
        title: DEFAULT_SECTION_TITLES.certificates,
        enabled: false,
      },
      accomplishments: {
        title: DEFAULT_SECTION_TITLES.accomplishments,
        enabled: false,
      },
      interests: { title: DEFAULT_SECTION_TITLES.interests, enabled: false },
      summary: { title: DEFAULT_SECTION_TITLES.summary, enabled: true },
      tailor: { title: DEFAULT_SECTION_TITLES.tailor, enabled: true },
      finish: { title: DEFAULT_SECTION_TITLES.finish, enabled: true },
    },
  },
  resume: {
    basics: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: "",
      url: "",
      location: {
        address: "",
      },
    },
    work: [],
    education: [],
    skills: [],
    certificates: [],
    interests: [],
    accomplishments: [],
    summary: {
      asObjective: false,
      content: "",
    },
  },
});
