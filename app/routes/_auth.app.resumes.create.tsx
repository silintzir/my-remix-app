import { createResume } from "@/lib/resumes.server";
import { fetchMe } from "@/lib/strapi.server";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const me = await fetchMe(request);
  const id = await createResume(request, me);
  return redirect(`/app/resumes/${id}/edit`);
}
