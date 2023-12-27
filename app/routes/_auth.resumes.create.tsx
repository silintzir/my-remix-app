import { createResume } from "@/lib/resumes.server";
import { fetchMe } from "@/lib/strapi.server";
import type { Lang } from "@/lib/types";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const language = fd.get("language") as Lang;
  const me = await fetchMe(request);
  const id = await createResume(request, me, { language });
  return redirect(`/resumes/${id}/edit`);
}
