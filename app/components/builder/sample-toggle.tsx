import { Toggle } from "@/components/ui/toggle";
import { useTemplateStore } from "@/lib/templates/store";
import { LibrarySquare } from "lucide-react";
import { useCallback } from "react";

export function SampleToggle() {
  const { setSampleMode, sampleMode } = useTemplateStore();
  const onPressedChange = useCallback(
    (value: boolean) => {
      setSampleMode(value);
    },
    [setSampleMode]
  );
  return (
    <Toggle
      aria-label="Toggle sample"
      onPressedChange={onPressedChange}
      title={sampleMode ? "Show my resume" : "Show sample resume"}
      className="data-[state=on]:bg-orange-400 data-[state=on]:text-black"
    >
      <LibrarySquare className="h-4 w-4 mr-2" />
      <span>{sampleMode ? "Sample resume" : "My resume"}</span>
    </Toggle>
  );
}
