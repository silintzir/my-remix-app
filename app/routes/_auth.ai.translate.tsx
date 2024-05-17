import { NoMemory } from "@/lib/ai/bot.server";
import { authenticatedFetch } from "@/lib/strapi.server";
import type { ResumeValues, StrapiLongResume } from "@/lib/types";
import { type ActionFunctionArgs } from "@remix-run/node";

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
    const steps = document.meta.steps;
    const bot = new NoMemory();
    const input = `Return the following JSON object values translated to ${target} keeping the same properties: ${JSON.stringify(
      { resume, steps }
    )}`;
    const response = JSON.parse(await bot.send(input)) as unknown as {
      resume: any;
      steps: any;
    };

    // await authenticatedFetch(request, `/api/resumes/${id}`, {
    //   method: "PUT",
    //   body: JSON.stringify({
    //     data: {
    //       document: {
    //         ...document,
    //         resume: response.resume,
    //         meta: {
    //           ...document.meta,
    //           language: target === "Spanish" ? "es" : "en",
    //           steps: response.steps,
    //         },
    //       } satisfies ResumeValues,
    //     },
    //   }),
    // });

    return response;
  } catch (e) {
    return null;
  }
}
