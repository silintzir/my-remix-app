import { Download } from "lucide-react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import getDefinition from "@/lib/templates/pdf.client";
import type { ResumeValues } from "@/lib/types";
import filenamify from "filenamify";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { DEFAULT_FONT_SIZE } from "@/lib/resume";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type Props = {
  values: ResumeValues;
  isSample?: boolean;
  fontSize?: number;
};
export function DownloadPdfButton({
  values,
  isSample = false,
  fontSize = DEFAULT_FONT_SIZE,
}: Props) {
  const create = useCallback(() => {
    const def = getDefinition(values, { isSample, fontSize });
    pdfMake
      .createPdf(def)
      .download(filenamify(`${values.meta.title} [resumerunner.io].pdf`));
  }, [values, isSample, fontSize]);

  return (
    <Button size="sm" className="h-[38px] my-0" onClick={create}>
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
