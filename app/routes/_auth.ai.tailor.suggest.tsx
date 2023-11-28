import { get, sampleSize, set } from "lodash-es";
import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticatedFetch } from "@/lib/strapi.server";
import { type AdapterSuggestion, type ResumeValues } from "@/lib/types";
import { v4 } from "uuid";
import { updateResume } from "@/lib/resumes.server";

export async function action({ request }: ActionFunctionArgs) {
  const sp = new URL(request.url).searchParams;
  const id = +(sp.get("id") as string);
  const fd = await request.formData();
  const body = fd.get("data") as string;

  const parsed = JSON.parse(body);
  const resume = parsed.resume as ResumeValues;
  const realResume = resume.resume as object;

  set(realResume, "work", { records: get(realResume, "work", []) });
  set(realResume, "education", {
    records: get(realResume, "education", []),
  });
  set(realResume, "skills", {
    records: get(realResume, "skills", []),
  });
  set(realResume, "interests", {
    records: get(realResume, "interests", []),
  });
  set(realResume, "certificates", {
    records: get(realResume, "certificates", []),
  });
  set(realResume, "accomplishments", {
    records: get(realResume, "accomplishment", []),
  });

  const toPost = {
    ...parsed,
    resume: realResume,
  };

  const response = await authenticatedFetch(request, "/api/tailor", {
    method: "POST",
    body: JSON.stringify(toPost),
  });

  const answers = get(response, "data.suggestions", []);
  const suggestions: Record<string, AdapterSuggestion> = {};
  for (let i = 0; i < sampleSize(answers, 5).length; i++) {
    const uuid = v4();
    suggestions[uuid] = {
      section: "",
      bullet: answers[i],
    };
  }

  await updateResume(request, id, {
    meta: { tailor: { suggestions } },
  } as Partial<ResumeValues>);

  return null;
}
