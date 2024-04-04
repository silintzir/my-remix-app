import type { ResumeValues, Template } from "@/lib/types";
import { ChicagoDocxTemplate } from "./docx-server/ChicagoDocxTemplate";
import { AccountantDocxTemplate } from "./docx-server/AccountantDocxTemplate";
import {
  AlignmentType,
  Document,
  Footer,
  NumberFormat,
  PageNumber,
  PageOrientation,
  Paragraph,
  TextRun,
} from "docx";
import { docxStyles } from "@/lib/templates/styles";
import { constr } from "./helpers/common";
import { Children } from "react";

type DefConf = {
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
};

export default function getDefinition(
  document: ResumeValues,
  { fontSize = 11, template = "chicago" }: DefConf
): Document {
  const styles =
    template === "chicago"
      ? docxStyles.chicago({ fontSize })
      : /* template === "accountant"
      ?  */ docxStyles.accountant({ fontSize });
  //   : docxStyles.executive({ fontSize })
  let struct: any;
  switch (template) {
    // case "executive":
    //   struct = new ExecutivePdfTemplate(document);
    //   break;
    case "accountant":
      struct = new AccountantDocxTemplate(document);
      break;
    default:
      struct = new ChicagoDocxTemplate(document);
  }

  return new Document({
    title: document.meta.title,
    styles,
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
        children: struct.create(),
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    children: [
                      PageNumber.CURRENT,
                      " of ",
                      PageNumber.TOTAL_PAGES,
                    ],
                  }),
                ],
                run: { size: 22 },
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
      },
    ],
  });
}
