import { Download } from "lucide-react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import getDefinition from "@/lib/templates/structure";
import { ResumeValues } from "@/lib/types";
import filenamify from "filenamify";

import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type Props = {
  values: ResumeValues;
  isSample?: boolean;
};
export function DownloadPdfButton({ values, isSample = false }: Props) {
  const create = useCallback(() => {
    const def = getDefinition(values, { isSample });
    pdfMake.createPdf(def).download(filenamify(`${values.meta.title} [resumerunner.io].pdf`));
  }, [values, isSample]);

  return (
    <Button size="sm" className="h-[38px] my-0 bg-blue-600 hover:bg-blue-500" onClick={create}>
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
