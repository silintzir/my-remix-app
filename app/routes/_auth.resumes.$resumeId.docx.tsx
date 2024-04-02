import { authenticatedFetch } from "@/lib/strapi.server";
import getDocument from "@/lib/templates/docx.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Document, NumberFormat, Packer, PageOrientation } from "docx";
import type { StrapiLongResume } from "@/lib/types";
import { docxStyles } from "@/lib/templates/styles";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const resumeId = params.resumeId as string;
  const response = await authenticatedFetch(
    request,
    `/api/resumes/${resumeId}`,
    { method: "GET" }
  );

  const data = response.data as StrapiLongResume;
  const values = data.attributes.document;

  const doc = getDocument(values, { isSample: false, fontSize: values.meta.fontSize, template: values.meta.template || "chicago" });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    headers: {
      "Content-Disposition": 'attachment; filename="MyDocument.docx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}
