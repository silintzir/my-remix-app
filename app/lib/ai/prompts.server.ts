import type { Lang, Step } from "@/lib/types";
import { getLanguage } from "@/lib/utils";

function introPrompt(lang: Lang) {
  const language = getLanguage(lang);
  return `You are an expert resume writer with the task of helping me rewrite my resume in ${language}, in a way that will quantify my achievements and help me elaborate on my qualifications for a hypothetic job opening I am pursuing. `;
}

function inputFormatPrompt() {
  return "My input follows as a JSON object, structured according to the jsonresume.org standard: ";
}

function enhancePrompt(terms: string) {
  return terms && terms.trim().length > 0
    ? `These suggestions must be necessarily relative to the following text in quotes: "${terms}". `
    : "";
}

function deliverablePrompt(lang: Lang) {
  return `Your response must be formatted as a JSON object with a single root property named "results" which must be an array of strings in ${getLanguage(
    lang
  )}  that correspond to your suggestions.`;
}

export function createPrompt(
  step: Step,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: any,
  enhance = "",
  lang: Lang = "en"
) {
  const toks = [];
  toks.push(introPrompt(lang));
  toks.push(inputDescription(step));
  toks.push(inputFormatPrompt());
  toks.push(`${JSON.stringify(context)}. `);
  toks.push(outputExpectation(step, context));
  toks.push(enhancePrompt(enhance));
  toks.push(deliverablePrompt(lang));
  toks.push();
  return toks.join("");
}

function inputDescription(step: Step) {
  switch (step) {
    case "education":
      return "I will provide you a part of my resume that describes the education that I received in the past. ";
    case "work":
      return "I will provide you a part of my resume that describes a job position I held in the past. ";
    default:
      return "I will provide you my resume that may contain info about my education, work history skills and certificates. ";
  }
}

function outputExpectation(step: Step, context: any) {
  switch (step) {
    case "education":
      return "Suggest 5 sentences of 10-15 words each, avoiding any numbering, that describe some courses/projects that I could add to this education entry in my resume to make it look more professional. ";
    case "work":
      return "Suggest 5 sentences of 10-15 words each, avoiding any numbering, that describe some highlights that I could add to this job position in my resume to make it look more professional. ";
    case "skills":
      return "Suggest 10 skills of at most 3 words each, avoiding any numbering, that I could add in the skills section of my my resume to make it look more professional. ";
    case "accomplishments":
      return "Suggest 10 sentences of 10-14 words each, avoiding any numbering, that I could add as accomplishments/highlights in my resume to make it look more professional. ";
    case "interests":
      return "Suggest 10 interests/hobbies of at most 3 words each, avoiding any numbering, that I could add in the interests/hobbies section of my my resume to make me look more attractive and interesting as a person. ";
    case "summary":
      if (context.asObjective) {
        return "Suggest 3 paragraphs, written in 3rd person with no verbs, of 30-50 words each, that I can use as the objective section in my resume to make it look more professional, attractive and interesting. ";
      } else {
        return "Suggest 3 paragraphs, written in 3rd person with no verbs, of 30-50 words each, that I can use as the summary section in my resume to make it look more professional, attractive and interesting. ";
      }
  }
}
