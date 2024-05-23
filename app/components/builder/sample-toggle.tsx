import { Toggle } from "@/components/ui/toggle";
import { useTemplateStore } from "@/lib/templates/store";
import { LibrarySquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SampleToggle() {
  const { setSampleMode, sampleMode } = useTemplateStore();
  const title = sampleMode ? "Show my resume" : "Show sample resume";
  const { t } = useTranslation();

  return (
    <Toggle
      aria-label={title}
      onPressedChange={setSampleMode}
      title={title}
      className="data-[state=on]:bg-orange-400 data-[state=on]:text-black"
    >
      <LibrarySquare />
      <span>
        {sampleMode ? t("builder.sample_resume") : t("builder.my_resume")}
      </span>
    </Toggle>
  );
}
