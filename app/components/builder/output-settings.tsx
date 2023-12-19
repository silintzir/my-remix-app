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
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";

interface Props {
  values: ResumeValues;
}
export function OutputSettings({ values }: Props) {
  const { control } = useFormContext<ResumeValues>();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <SlidersHorizontal />
          <span>Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Resume print settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure the look and feel of the resume.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Paper size</Label>
              <SelectInput
                control={control}
                options={[
                  { label: "A4", value: "A4" },
                  { label: "US Letter", value: "LETTER" },
                ]}
                name="meta.paperSize"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Font size</Label>
              <FontSizeAdjust />
              <strong>{values.meta.fontSize}pt</strong>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="maxWidth">Vertical margin</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                className={cn("w-full")}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
