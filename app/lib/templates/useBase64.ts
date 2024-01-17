import { useEffect, useState } from "react";
import getDefinition from "@/lib/templates/pdf.client";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import type { ResumeValues, Template } from "../types";
import { DEFAULT_FONT_SIZE } from "../resume";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type Config = {
  values: ResumeValues;
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
};
export function useBase64({
  values,
  isSample = false,
  fontSize = DEFAULT_FONT_SIZE,
  template = "chicago",
}: Config): string {
  const [base64, setBase64] = useState("");

  useEffect(() => {
    const def = getDefinition(values, { isSample, fontSize, template });
    pdfMake.createPdf(def).getBase64((data) => {
      setBase64(data);
    });
  }, [values, isSample, fontSize, template]);

  return base64;
}
