import { translate } from "@/lib/ai/translation.server";
import { authenticatedFetch } from "@/lib/strapi.server";
import type { StrapiLongResume } from "@/lib/types";
import { type ActionFunctionArgs } from "@remix-run/node";

const REPLACEMENT_KEYS = {
  RESUME: ["name", "position", "content", "area", "studyType", "institution"],
  STEPS: ["title"],
};

export async function action({ request }: ActionFunctionArgs) {
  const { id, target } = Object.fromEntries(
    await request.formData()
  ) as unknown as { id: string; target: string };

  try {
    const record: { data: StrapiLongResume } = await authenticatedFetch(
      request,
      `/api/resumes/${id}`,
      {
        method: "GET",
      }
    );
    const document = record.data.attributes.document;
    const resume = document.resume;
    const resumeStrings = extractStrings(resume, REPLACEMENT_KEYS.RESUME);
    const steps = document.meta.steps;
    const titleStrings = extractStrings(steps, REPLACEMENT_KEYS.STEPS);
    const translationReq = { from: document.meta.language, to: target };
    const translationResult = await Promise.all([
      translate(resumeStrings, translationReq),
      translate(titleStrings, translationReq),
    ]);
    const response = {
      resume: replaceStringValues(
        resume,
        REPLACEMENT_KEYS.RESUME,
        translationResult[0][0]
      ),
      steps: replaceStringValues(
        steps,
        REPLACEMENT_KEYS.STEPS,
        arrayToTitleCase(translationResult[1][0])
      ),
    };
    return response;
  } catch (e) {
    console.error("Google translation failed.", JSON.stringify(e));
    return null;
  }
}

const strToTitleCase = (str: string) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const arrayToTitleCase = (arr: string[]) =>
  arr.map((item) => (item ? strToTitleCase(item) : item));

const extractStrings = (obj: any, keys: string[]): string[] => {
  const result: string[] = [];

  const traverse = (currentObj: any) => {
    if (Array.isArray(currentObj)) {
      for (const item of currentObj) {
        traverse(item);
      }
    } else if (currentObj && typeof currentObj === "object") {
      for (const key in currentObj) {
        if (
          keys.includes(key) &&
          currentObj[key] &&
          typeof currentObj[key] === "string"
        ) {
          result.push(currentObj[key]);
        }
        traverse(currentObj[key]);
      }
    }
  };

  traverse(obj);
  return result;
};

const replaceStringValues = <T,>(
  obj: T,
  keys: string[],
  replacements: string[]
) => {
  let replacementIndex = 0;

  const traverse = <S,>(currentObj: S): S => {
    if (Array.isArray(currentObj)) {
      return currentObj.map((item) => traverse(item)) as S;
    } else if (currentObj && typeof currentObj === "object") {
      const newObj: any = {};
      for (const key in currentObj) {
        if (
          keys.includes(key) &&
          currentObj[key] &&
          typeof currentObj[key] === "string" &&
          replacementIndex < replacements.length
        ) {
          newObj[key] = replacements[replacementIndex];
          replacementIndex++;
        } else {
          newObj[key] = traverse(currentObj[key]);
        }
      }
      return newObj;
    } else {
      return currentObj;
    }
  };

  return traverse(obj);
};
