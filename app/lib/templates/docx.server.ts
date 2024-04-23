import type { ResumeValues, Template } from "@/lib/types";
import { ChicagoDocxTemplate } from "./docx-server/ChicagoDocxTemplate";
import { AccountantDocxTemplate } from "./docx-server/AccountantDocxTemplate";
import { ExecutiveDocxTemplate } from "./docx-server/ExecutiveDocxTemplate";
import {
  AlignmentType,
  Document,
  Footer,
  IStylesOptions,
  NumberFormat,
  PageNumber,
  PageOrientation,
  Paragraph,
  TextRun,
} from "docx";
import { docxStyles } from "./docx-server/styles";
import { DEFAULT_FONT_SIZE } from "../resume";

type DefConf = {
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
};

export default function getDefinition(
  document: ResumeValues,
  { fontSize = DEFAULT_FONT_SIZE, template = "chicago" }: DefConf
): Document {
  let styles: IStylesOptions;
  let struct: any;
  switch (template) {
    case "executive":
      struct = new ExecutiveDocxTemplate(document);
      styles = docxStyles.executive({ fontSize });
      break;
    case "accountant":
      struct = new AccountantDocxTemplate(document);
      styles = docxStyles.accountant({ fontSize });
      break;
    default:
      struct = new ChicagoDocxTemplate(document);
      styles = docxStyles.chicago({ fontSize });
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
                run: { size: fontSize * 2 },
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
      },
    ],
  });
}
