import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import usFlag from "@/images/us-flag.svg";
import esFlag from "@/images/es-flag.svg";

type Props = {
  resumeId: number;
};

export function TranslateModal({ resumeId }: Props) {
  const { watch } = useFormContext<ResumeValues>();

  const lang = watch("meta.language");

  return (
    <span>
      <img
        src={lang === "en" ? usFlag : esFlag}
        height="16"
        width="16"
        alt="Language"
      />
    </span>
  );
}
