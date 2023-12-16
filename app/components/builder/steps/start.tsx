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
import { Lock } from "lucide-react";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { LanguagePicker } from "../language-picker";
import { arrayMoveImmutable } from "array-move";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";


export function StartStep() {
  const { control, watch, setValue, register } = useFormContext<ResumeValues>();

  const mode = watch("meta.mode");

  const order = watch("meta.order") as Step[];

  const onSortEnd = useCallback(
    ({
      oldIndex,
      newIndex,
    }: {
      oldIndex: number;
      newIndex: number;
    }) => {
      setValue("meta.order", arrayMoveImmutable(order, oldIndex, newIndex), { shouldDirty: true });
    },
    [order, setValue],
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
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="standard" id="r1" />
                      <div className="flex flex-col gap-0">
                        <Label htmlFor="r1">Standard resume</Label>
                        <FormDescription>
                          Experience, education, skills, Interests & Summary
                        </FormDescription>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="custom" id="r2" />
                      <div className="flex flex-col gap-0">
                        <Label htmlFor="r2">Custom resume</Label>
                        <FormDescription>
                          Use the custom setup if you to want to add extra sections in your resume
                          and omit any of the standard ones. Also reorder them as needed. You may
                          come back and change that at any time.
                        </FormDescription>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
              {mode === "custom" && (
                <div className="space-y-2 text-sm ml-5">
                  <SortableList lockAxis="y" onSortEnd={onSortEnd} useDragHandle className="space-y-3">
                    {order.map((step, index) => (
                      <SortableItem index={index} key={step}>
                        <SortableHandle />
                        <FormField
                          key={step}
                          control={control}
                          name={`meta.steps.${step}.enabled`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-16 space-y-0">
                              <FormLabel className="min-w-[120px]">
                                {DEFAULT_SECTION_TITLES[step]}
                              </FormLabel>
                              <FormControl>
                                {nonConfigurableSteps.includes(step) ? (
                                  <div className="w-full small muted flex gap-1 items-center">
                                    <Lock className="w-4 h-4" />
                                    <span>Locked</span>
                                    <input
                                      {...register(`meta.steps.${step}.enabled`)}
                                      type="hidden"
                                    />
                                  </div>
                                ) : (
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </SortableItem>
                    ))}
                  </SortableList>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
