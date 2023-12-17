import { authenticatedFetch } from "@/lib/strapi.server";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";

export async function action({ request, params }: ActionFunctionArgs) {
  const { resumeId } = params;
  await authenticatedFetch(request, `/api/resumes/${resumeId}`, {
    method: "DELETE",
  });

  return redirect("/account/dashboard");
}
