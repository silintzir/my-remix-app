import { DASHBOARD } from "@/lib/routes";
import { authenticatedFetch } from "@/lib/strapi.server";
import { type ActionFunctionArgs } from "@remix-run/node";
import { redirectWithSuccess } from "remix-toast";

export async function action({ request, params }: ActionFunctionArgs) {
  const { resumeId } = params;
  await authenticatedFetch(request, `/api/resumes/${resumeId}`, {
    method: "DELETE",
  });

  return redirectWithSuccess(DASHBOARD, "Resume was deleted");
}
