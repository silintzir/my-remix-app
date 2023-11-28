import { createResume } from "@/lib/resumes.server";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const id = await createResume(request);
  return redirect(`/app/resumes/${id}/edit`);
}
