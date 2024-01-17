import { NoMemory } from "@/lib/ai/bot.server";
import { authenticatedFetch } from "@/lib/strapi.server";
import { StrapiLongResume } from "@/lib/types";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import chalk from "chalk";
import { get } from "lodash-es";

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
    console.log(response);

    // record.data.attributes.document.meta.steps = response.

    await authenticatedFetch(request, `/api/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        data: {
          document: {
            ...document,
            resume: response.resume,
            meta: {
              steps: response.steps,
            },
          },
        },
      }),
    });

    return null;
  } catch (e) {
    console.error(chalk.red(`Failed to translate with AI`));
    return json({
      test: 0,
    });
  }
}
