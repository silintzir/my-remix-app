import { authenticatedFetch } from "@/lib/strapi.server";
import type { StrapiLongResume } from "@/lib/types";
import type { ActionFunctionArgs } from "@remix-run/node";
import { find, remove } from "lodash-es";

export async function action({ request }: ActionFunctionArgs) {
  const sp = new URL(request.url).searchParams;
  const id = +(sp.get("id") as string);
  const fd = await request.formData();
  const body = fd.get("data") as string;

  const { uuid, section } = JSON.parse(body) as {
    uuid: string;
    section: string;
  };

  let response: { data: StrapiLongResume } = await authenticatedFetch(
    request,
    `/api/resumes/${id}`,
    { method: "GET" }
  );
  const found = !!response.data;
  if (!found) {
    console.log("invalid document");
    return null;
  }
  const document = response.data.attributes.document;
  const suggested = document.meta.tailor.suggestions[uuid];

  if (!suggested) {
    console.log("invalid suggestion");
    return null;
  }

  const prevSection = suggested.section;
  suggested.section = section;

  if (section === "" || prevSection.length > 0) {
    const toks = prevSection.split("::");
    const [sectionToRemove, uuidToRemove] = toks;
    if (sectionToRemove === "work") {
      const match = find(
        document.resume.work,
        ({ uuid }) => uuid === uuidToRemove
      );
      if (match && match.bullets) {
        remove(match.bullets, (b) => b.uuid === uuid);
      }
    } else if (sectionToRemove === "education") {
      const match = find(
        document.resume.education,
        ({ uuid }) => uuid === uuidToRemove
      );
      if (match && match.bullets) {
        remove(match.bullets, (b) => b.uuid === uuid);
      }
    } else if (sectionToRemove === "skills") {
      remove(document.resume.skills, (s) => s.uuid === uuid);
    } else if (sectionToRemove === "accomplishments") {
      remove(document.resume.accomplishments, (s) => s.uuid === uuid);
    }
  }

  if (section !== "") {
    // add bullet to section
    const toks = section.split("::");
    const [sectionToAppend, sectionRecordUuid] = toks;

    if (sectionToAppend === "work") {
      const match = find(
        document.resume.work,
        (record) => record.uuid === sectionRecordUuid
      );

      if (match && match.bullets) {
        match.bullets.push({
          uuid,
          content: suggested.bullet,
        });
      }
    } else if (sectionToAppend === "education") {
      const match = find(
        document.resume.education,
        (record) => record.uuid === sectionRecordUuid
      );

      if (match && match.bullets) {
        match.bullets.push({
          uuid,
          content: suggested.bullet,
        });
      }
    } else if (sectionToAppend === "skills") {
      document.resume.skills.push({
        uuid,
        name: suggested.bullet,
        level: "no_mention",
      });
    } else if (sectionToAppend === "accomplishments") {
      document.resume.accomplishments.push({
        uuid,
        name: suggested.bullet,
      });
    }
  }

  response = await authenticatedFetch(request, `/api/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      data: {
        document,
      },
    }),
  });

  console.log(response);

  return null;
}
