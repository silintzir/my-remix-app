import { Download, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "@remix-run/react";
import { Button, type ButtonProps } from "../ui/button";
import { useCallback } from "react";
import getDefinition from "@/lib/templates/pdf.client";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import filenamify from "filenamify";
import type { ResumeValues, Template } from "@/lib/types";
import { DEFAULT_FONT_SIZE } from "@/lib/resume";
import { useTranslation } from "react-i18next";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface Props extends ButtonProps {
  resumeId: number;
  values: ResumeValues;
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
}
export function ExportActions({
  resumeId,
  values,
  isSample = false,
  fontSize = DEFAULT_FONT_SIZE,
  template = "chicago",
  ...rest
}: Props) {
  const { t } = useTranslation();
  const create = useCallback(() => {
    const def = getDefinition(values, { isSample, fontSize, template });
    pdfMake.createPdf(def).download(filenamify(`${values.meta.title}.pdf`));
  }, [values, isSample, fontSize, template]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...rest}>
          <Download />
          &nbsp; {t("builder.download")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={create}>
            <div className="flex gap-2 items-center">
              <Download className="w-4 h-4" />
              <span>Export to PDF</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/resumes/${resumeId}/docx`} target="_blank">
              <Download />
              <span>{t("dashboard.export_ms")}</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild> */}
          {/*   <Link to={`/resumes/${resumeId}/json`} target="_blank"> */}
          {/*     <Download /> */}
          {/*     <span>Export to JSON</span> */}
          {/*   </Link> */}
          {/* </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
