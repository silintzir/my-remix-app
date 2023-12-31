import { CaseSensitive, Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useFormContext } from "react-hook-form";
import type { ResumeValues } from "@/lib/types";
import { DEFAULT_FONT_SIZE, MAX_FONT_SIZE, MIN_FONT_SIZE } from "@/lib/resume";

export function FontSizeAdjust() {
  const { watch, setValue } = useFormContext<ResumeValues>();
  const fontSize = watch("meta.fontSize");
  return (
    <div className="flex items-center small gap-px h-10">
      <Button
        type="button"
        variant="ghost"
        title="Decrease font size"
        className="px-1"
        onClick={() =>
          setValue("meta.fontSize", Math.max(MIN_FONT_SIZE, fontSize - 1), {
            shouldDirty: true,
          })
        }
        size="sm"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        type="button"
        title="Reset font size"
        onClick={() =>
          setValue("meta.fontSize", DEFAULT_FONT_SIZE, { shouldDirty: true })
        }
        className="px-1"
        size="sm"
      >
        <CaseSensitive className="h-6 w-6" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        title="Increase font size"
        onClick={() =>
          setValue("meta.fontSize", Math.min(MAX_FONT_SIZE, fontSize + 1), {
            shouldDirty: true,
          })
        }
        className="px-1"
        size="sm"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
