import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { FontSizeAdjust } from ".";
import { useFormContext } from "react-hook-form";
import type { ResumeValues } from "@/lib/types";
import { SelectInput } from "../shadcn/SelectInput";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Props {
  values: ResumeValues;
}
export function OutputSettings({ values }: Props) {
  const { control, getValues } = useFormContext<ResumeValues>();
  const [open, setOpen] = useState<string | false>(false);

  const translator = useFetcher({ key: "translate" });

  useEffect(() => {
    if (open) {
      const ans = confirm("Translate the resume text to the target language?");
      if (ans) {
        const fd = new FormData();
        fd.append("values", JSON.stringify(getValues()));
        fd.append("target", open);
        translator.submit(fd, {
          method: "POST",
          action: `/ai/translate`,
        });
      }
      setOpen(false);
    }
  }, [open, setOpen, getValues, translator]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <SlidersHorizontal />
          <span>Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="maxWidth">Language</Label>
          <SelectInput
            className="w-full"
            control={control}
            options={[
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
            ]}
            onChange={(value) => {
              setTimeout(() => {
                setOpen(value);
              }, 1000);
            }}
            name="meta.language"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="width">Font size</Label>
          <FontSizeAdjust />
          <strong>{values.meta.fontSize}pt</strong>
        </div>
      </PopoverContent>
    </Popover>
  );
}
