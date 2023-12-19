import { authenticatedFetch } from "@/lib/strapi.server";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request, params }: ActionFunctionArgs) {
  const { resumeId } = params;
  await authenticatedFetch(request, `/api/resumes/${resumeId}`, {
    method: "PUT",
    body: JSON.stringify({
      data: await request.json(),
    }),
  });

  return null;
}
