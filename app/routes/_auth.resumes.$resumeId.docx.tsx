import { authenticatedFetch } from "@/lib/strapi.server";
import { ChicagoDocxTemplate } from "@/lib/templates/docx.server";
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
  const document = data.attributes.document;

  const structurer = new ChicagoDocxTemplate(document);

  const doc = new Document({
    title: document.meta.title,
    styles: docxStyles.chicago({ fontSize: 11 }),
    sections: [
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
            size: {
              width: `${8.5 * 72}pt`,
              height: `${11 * 72}pt`,
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: `${0.5 * 72}pt`,
              bottom: `${0.5 * 72}pt`,
              right: `${0.5 * 72}pt`,
              left: `${0.5 * 72}pt`,
            },
          },
        },
        children: structurer.create(),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    headers: {
      "Content-Disposition": 'attachment; filename="MyDocument.docx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });
}
