import { StepHeader } from "@/components/builder/header";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import type { ResumeValues, Step } from "@/lib/types";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { LanguagePicker } from "../language-picker";
import { arrayMoveImmutable } from "array-move";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { TextInput } from "@/components/shadcn/TextInput";

export function StartStep() {
  const { control, watch, setValue } = useFormContext<ResumeValues>();

  const order = watch("meta.order") as Step[];

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      setValue("meta.order", arrayMoveImmutable(order, oldIndex, newIndex), {
        shouldDirty: true,
      });
    },
    [order, setValue]
  );

  const nonConfigurableSteps: Step[] = ["basics", "work"];

  return (
    <div className="space-y-2">
      <StepHeader step="start" />
      <LanguagePicker />
      <FormField
        control={control}
        name="meta.mode"
        render={({ field }) => {
          return (
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Resume mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="standard" id="r1" />
                      <div className="flex flex-col gap-0">
                        <Label htmlFor="r1">Standard resume</Label>
                        <FormDescription className="text-muted-foreground">
                          Experience, education, skills, Interests & Summary
                        </FormDescription>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="custom" id="r2" />
                      <div className="flex flex-col gap-0">
                        <Label htmlFor="r2">Custom resume</Label>
                        <FormDescription>
                          Use the custom setup if you to want to enable extra
                          sections in your resume or omit any of the standard
                          ones. Also reorder them as needed. You may come back
                          and change that at any time. For each section, you may
                          edit the title that will display inside the resume.
                        </FormDescription>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
              <h4 className="font-semibold">Resume sections</h4>
              <div className="space-y-2 text-sm">
                <SortableList
                  lockAxis="y"
                  onSortEnd={onSortEnd}
                  useDragHandle
                  className="space-y-3"
                >
                  {order.map((step, index) => (
                    <SortableItem index={index} key={step}>
                      <SortableHandle />
                      <FormField
                        key={step}
                        control={control}
                        name={`meta.steps.${step}.enabled`}
                        render={({ field }) => (
                          <FormItem className="min-w-[140px] flex items-center gap-16 space-y-0">
                            <FormLabel className="min-w-[110px]">
                              {DEFAULT_SECTION_TITLES[step]}
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                disabled={nonConfigurableSteps.includes(step)}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <TextInput
                        className="w-60"
                        control={control}
                        name={`meta.steps.${step}.title`}
                        placeholder={DEFAULT_SECTION_TITLES[step]}
                      />
                    </SortableItem>
                  ))}
                </SortableList>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
