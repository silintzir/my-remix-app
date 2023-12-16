import { authenticatedFetch } from "@/lib/strapi.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { StrapiLongResume } from "@/lib/types";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const resumeId = params.resumeId as string;
  const response = await authenticatedFetch(
    request,
    `/api/resumes/${resumeId}`,
    { method: "GET" }
  );

  const data = response.data as StrapiLongResume;
  const document = data.attributes.document;

  return new Response(JSON.stringify(document), {
    headers: {
      "Content-Disposition": 'attachment; filename="resumerunner.json"',
      "Content-Type": "application/json",
    },
  });
}
