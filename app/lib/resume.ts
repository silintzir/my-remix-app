import { z } from "zod";
import type { CertificateRecord, EducationRecord, WorkRecord } from "./types";
import { getReadableDateFromPicker } from "./utils";

export const MIN_FONT_SIZE = 8;
export const DEFAULT_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 16;

export const bulletSchema = z.object({
  uuid: z.string(),
  content: z.string(),
});

export const skillSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  level: z.string(),
});

export const interestSchema = z.object({
  uuid: z.string(),
  name: z.string(),
});

export const accomplishmentSchema = z.object({
  uuid: z.string(),
  name: z.string(),
});

export const summarySchema = z.object({
  asObjective: z.boolean(),
  objectiveTarget: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export const adapterSuggestionSchema = z.object({
  bullet: z.string(),
  section: z.string(),
});

export const tailorSchema = z.object({
  content: z.string(),
  suggestions: z.record(z.string(), adapterSuggestionSchema),
});

export const certificateSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  date: z.string(),
  issuer: z.string(),
  url: z.string(),
});

export const workSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),

  startMonth: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  toPresent: z.boolean().optional().default(false),

  city: z.string(),
  state: z.string(),
  bullets: z.array(bulletSchema).optional(),
});

export const basicsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.object({
    address: z.any(),
  }),
  url: z.string(),
});

export const educationSchema = z.object({
  uuid: z.string(),
  institution: z.string(),
  area: z.string(),
  studyType: z.string(),
  startDate: z.string(),
  endDate: z.string(),

  startMonth: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  toPresent: z.boolean().optional().default(false),

  city: z.string(),
  state: z.string(),
  status: z.string(),
  bullets: z.array(bulletSchema).optional(),
});

export const stepConfigSchema = z.object({
  title: z.string(),
  enabled: z.boolean(),
});

export const resumeSchema = z.object({
  meta: z.object({
    order: z.array(z.string()),
    maskBasics: z.boolean().optional().default(false),
    title: z.string(),
    paperSize: z.enum(["A4", "LETTER"]),
    fontSize: z.number(),
    language: z.enum(["en", "es"]),
    mode: z.enum(["standard", "custom"]),
    tailor: tailorSchema,
    template: z.enum(["chicago", "executive", "accountant"]),
    autoSort: z.object({
      work: z.boolean().optional().default(true),
      education: z.boolean().optional().default(true),
      certificates: z.boolean().optional().default(true),
    }),
    steps: z.object({
      start: stepConfigSchema,
      basics: stepConfigSchema,
      work: stepConfigSchema,
      education: stepConfigSchema,
      skills: stepConfigSchema,
      interests: stepConfigSchema,
      certificates: stepConfigSchema,
      accomplishments: stepConfigSchema,
      summary: stepConfigSchema,
      tailor: stepConfigSchema,
      preview: stepConfigSchema,
      finish: stepConfigSchema,
    }),
  }),
  resume: z.object({
    basics: basicsSchema,
    summary: summarySchema,
    work: z.array(workSchema),
    education: z.array(educationSchema),
    skills: z.array(skillSchema),
    interests: z.array(interestSchema),
    certificates: z.array(certificateSchema),
    accomplishments: z.array(accomplishmentSchema),
  }),
});

export function getExperienceTitle(values: WorkRecord) {
  const toks = [];
  if (values.position?.length) {
    toks.push(values.position);
  }
  if (values.name?.length) {
    toks.push(values.name);
  }
  return toks.length ? toks.join(" @ ") : "(Unknown position)";
}

export function getEducationTitle(values: EducationRecord) {
  const toks = [];
  if (values.area?.length) {
    toks.push(values.area);
  }
  if (values.institution?.length) {
    toks.push(values.institution);
  }
  return toks.length ? toks.join(" @ ") : "(Not specified)";
}

export function getCertificateTitle(values: CertificateRecord) {
  const toks = [];
  if (values.name?.length) {
    toks.push(values.name);
  }
  if (values.issuer?.length) {
    toks.push(values.issuer);
  }
  return toks.length ? toks.join(" from ") : "(Not specified)";
}

export function getRecordPeriod(values: {
  startDate?: string;
  endDate?: string;
}) {
  const toks = [];
  if (values.startDate?.length) {
    toks.push(getReadableDateFromPicker(values.startDate));
  }

  if (values.endDate?.length) {
    toks.push(getReadableDateFromPicker(values.endDate));
  }
  return toks.length ? toks.join(" - ") : "No dates set";
}

export function getRecordPeriod2(values: {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  toPresent?: boolean;
}) {
  const { startMonth, startYear, endMonth, endYear, toPresent } = values;
  const toks = [];
  const from = [];
  const to = [];
  if (startYear?.length && startYear !== "-") {
    if (startMonth?.length && startMonth !== "-") {
      from.push(startMonth);
    }
    from.push(startYear);
  }
  if (from.length) {
    toks.push(from.join("/"));
  }

  if (toPresent) {
    to.push("Present");
  } else {
    if (endYear?.length && endYear !== "-") {
      if (endMonth?.length && endMonth !== "-") {
        to.push(endMonth);
      }
      to.push(endYear);
    }
  }
  if (to.length) {
    toks.push(to.join("/"));
  }

  return toks.join(" - ");
}

export function getSkillLevelOptions() {
  return [
    { label: "No mention", value: "no_mention" },
    { label: "Beginner", value: "beginner" },
    { label: "Advanced", value: "advanced" },
    { label: "Expert", value: "expert" },
  ];
}

export function getEducationDegreeOptions() {
  return [
    { label: "No mention", value: "no_mention" },
    { label: "High School Diploma", value: "high_school_diploma" },
    {
      label: "Vocational or Technical Certificate",
      value: "vocational_technical_certificate",
    },
    { label: "Associate's Degree", value: "associates_degree" },
    { label: "Bachelor's Degree", value: "bachelors_degree" },
    {
      label: "Post-Baccalaureate Certificate",
      value: "post_baccalaureate_certificate",
    },
    { label: "Master's Degree", value: "masters_degree" },
    { label: "Professional Degree", value: "professional_degree" },
    { label: "Doctorate Degree (Ph.D.)", value: "doctorate_degree" },
    { label: "Post-Doctoral Training", value: "post_doctoral_training" },
    { label: "No Formal Education", value: "no_formal_education" },
  ];
}

export function getMonthOptions() {
  const months = [{ label: "-", value: "-" }];

  for (let i = 1; i <= 12; i++) {
    const monthNumber = i.toString().padStart(2, "0"); // Ensures the month number has two digits
    months.push({ value: monthNumber, label: monthNumber });
  }
  return months;
}

export function getYearOptions() {
  const years = [{ label: "-", value: "-" }];
  const currentYear = new Date().getFullYear(); // Get the current year
  for (let year = currentYear; year >= 1970; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
}
