import { authenticatedFetch } from "./strapi.server";
import { get, set } from "lodash-es";
import type {
  Lang,
  ResumeValues,
  StrapiLongResume,
  StrapiShortResume,
  StrapiUser,
} from "./types";
import merge from "deepmerge";
import { DEFAULT_RESUME_TITLE, defaultResumeValues } from "./defaults";

interface CreateConfig {
  language: Lang;
}
export async function createResume(
  request: Request,
  me: StrapiUser,
  { language }: CreateConfig
) {
  const url = "/api/resumes";
  const response = await authenticatedFetch(request, url, {
    method: "POST",
    body: JSON.stringify({
      data: {
        name: DEFAULT_RESUME_TITLE,
        document: defaultResumeValues(me, language),
      },
    }),
  });
  return get(response, "data.id") as number;
}

export async function importResume(request: Request, values: ResumeValues) {
  const url = "/api/resumes";
  const response = await authenticatedFetch(request, url, {
    method: "POST",
    body: JSON.stringify({
      data: {
        name: DEFAULT_RESUME_TITLE,
        document: values,
      },
    }),
  });
  return get(response, "data.id") as number;
}

export async function getResumes(request: Request) {
  const response = await authenticatedFetch(
    request,
    "/api/resumes?fields[0]=name&fields[1]=createdAt&fields[2]=updatedAt&fields[3]=document",
    { method: "GET" }
  );

  return get(response, "data", []) || ([] as StrapiShortResume[]);
}

export async function updateResume(
  request: Request,
  id: number,
  data: Partial<ResumeValues>,
  resetSuggestions = true
) {
  const response: { data: StrapiLongResume } = await authenticatedFetch(
    request,
    `/api/resumes/${id}`,
    { method: "GET" }
  );
  const document = get(response, "data.attributes.document") as ResumeValues;

  if (resetSuggestions) {
    set(document, "meta.tailor.suggestions", []);
  }
  const newDocument = merge(document, data);
  await authenticatedFetch(request, `/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      data: {
        document: newDocument,
      },
    }),
  });
}
