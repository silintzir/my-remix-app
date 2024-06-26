import type { Lang, ResumeValues, Step, StrapiUser } from "./types";

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
  preview: "Preview",
  finish: "Finish",
};

export const DEFAULT_SECTIONT_TITLES_ES: Record<Step, string> = {
  start: "Iniciar",
  basics: "Información básica",
  work: "Experiencia",
  education: "Educación",
  skills: "Habilidades",
  accomplishments: "Logros",
  certificates: "Certificados",
  interests: "Intereses",
  summary: "Resumen",
  tailor: "Job tailor",
  preview: "Avance",
  finish: "Finalizar",
};

export const DEFAULT_STEPS: Step[] = [
  "start",
  "basics",
  "summary",
  "work",
  "education",
  "skills",
  "interests",
  "preview",
  "finish",
];

export const DEFAULT_STEPS_ORDER: Step[] = [
  "basics",
  "summary",
  "work",
  "education",
  "skills",
  "certificates",
  "accomplishments",
  "interests",
];

export const DEFAULT_STEPS_SETUP = {
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
  preview: { title: DEFAULT_SECTION_TITLES.preview, enabled: true },
  finish: { title: DEFAULT_SECTION_TITLES.finish, enabled: true },
};

export const defaultResumeValues = (
  user: Pick<StrapiUser, "firstName" | "lastName" | "email">,
  language: Lang = "en"
): ResumeValues => ({
  meta: {
    title: DEFAULT_RESUME_TITLE,
    maskBasics: false,
    paperSize: "LETTER",
    template: "chicago",
    language,
    mode: "standard",
    tailor: { content: "", suggestions: {} },
    fontSize: 10,
    order: [...DEFAULT_STEPS_ORDER],
    autoSort: {
      education: true,
      work: true,
      certificates: true,
    },
    steps: { ...DEFAULT_STEPS_SETUP },
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
      objectiveTarget: "",
      content: "",
    },
  },
});
