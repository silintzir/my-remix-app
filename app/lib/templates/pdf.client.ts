import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { ResumeValues, Template } from "@/lib/types";
import { pdfStyles } from "./pdf-client/styles";
import { AccountantPdfTemplate } from "./pdf-client/AccountantPdfTemplate";
import { ExecutivePdfTemplate } from "./pdf-client/ExecutivePdfTemplate";
import { ChicagoPdfTemplate } from "./pdf-client/ChicagoPdfTemplate";
import { DEFAULT_FONT_SIZE } from "../resume";

export interface ContentProvider {
  (): Content[];
}

type DefConf = {
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
};

export default function getDefinition(
  data: ResumeValues,
  { isSample = false, fontSize = DEFAULT_FONT_SIZE, template = "chicago" }: DefConf
): TDocumentDefinitions {
  const styles =
    template === "chicago"
      ? pdfStyles.chicago({ fontSize })
      : template === "accountant"
      ? pdfStyles.accountant({ fontSize })
      : pdfStyles.executive({ fontSize });
  let struct: any;
  switch (template) {
    case "executive":
      struct = new ExecutivePdfTemplate(data);
      break;
    case "accountant":
      struct = new AccountantPdfTemplate(data);
      break;
    default:
      struct = new ChicagoPdfTemplate(data);
  }

  return {
    styles,
    pageSize: "LETTER",
    ...(isSample
      ? {
          watermark: { text: "Sample resume", fontSize: 60 },
        }
      : {}),
    footer: (currentPage, pageCount) => ({
      text: `${currentPage.toString()} of ${pageCount.toString()}`,
      alignment: "center",
      fontSize: 1.1 * fontSize,
    }),
    content: struct.create(),
  };
}
