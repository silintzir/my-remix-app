import { useEffect, useState } from "react";
import getDefinition from "@/lib/templates/pdf.client";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import type { ResumeValues } from "../types";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type Config = {
  values: ResumeValues;
  isSample?: boolean;
};
export function useBase64({ values, isSample = false }: Config): string {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    const def = getDefinition(values, { isSample });
    pdfMake.createPdf(def).getBase64((data) => {
      setBase64(data);
    });
  }, [values, isSample]);

  return base64;
}
