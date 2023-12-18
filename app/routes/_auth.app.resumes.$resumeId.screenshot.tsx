import { authenticatedFetch } from "@/lib/strapi.server";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request, params }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData());
  const { resumeId } = params;
  await authenticatedFetch(request, `/api/resumes/${resumeId}`, {
    method: "PUT",
    body: JSON.stringify({
      data,
    }),
  });

  return null;
}
