import { Link } from "@remix-run/react";
import { Button, type ButtonProps } from "../ui/button";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props extends ButtonProps {
  resumeId: number;
}

export function OpenPreview({ resumeId, ...rest }: Props) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/resumes/${resumeId}/edit?view=preview`}
      className="flex items-center text-sm"
    >
      <Download />
      <span>{t("base.preview_download")}</span>
    </Link>
  );
}
