import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_STEPS_ORDER,
  DEFAULT_SECTION_TITLES,
  DEFAULT_STEPS_SETUP,
} from "@/lib/defaults";
import type { ResumeValues, Step } from "@/lib/types";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { arrayMoveImmutable } from "array-move";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { TextInput } from "@/components/shadcn/TextInput";
import { Button } from "@/components/ui/button";
import { RotateCcw, Settings2 } from "lucide-react";

export function StartStep() {
  const { control, watch, setValue } = useFormContext<ResumeValues>();

  const order = watch("meta.order") as Step[];
  const mode = watch("meta.mode");

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
      <h4 className="font-semibold flex justify-between items-center">
        <span>Resume sections</span>
        {mode === "custom" ? (
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setValue("meta.mode", "standard", { shouldDirty: true });
              setValue("meta.order", [...DEFAULT_STEPS_ORDER], {
                shouldDirty: true,
              });
              setValue(
                "meta.steps",
                { ...DEFAULT_STEPS_SETUP },
                { shouldDirty: true }
              );
            }}
          >
            <RotateCcw />
            <span>Use defaults</span>
          </Button>
        ) : (
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setValue("meta.mode", "custom", { shouldDirty: true });
            }}
          >
            <Settings2 />
            <span>Configure sections</span>
          </Button>
        )}
      </h4>
      <p className="muted">
        Continue with the defaults or configure which sections to include, their
        order and title inside your resume. You may come back to this step at
        any time and make changes.
      </p>

      {mode === "custom" && (
        <div className="space-y-2 text-xs sm:text-sm">
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
                    <FormItem className="flex items-center gap-16 space-y-0">
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
                  className="flex-grow"
                  control={control}
                  name={`meta.steps.${step}.title`}
                  placeholder={DEFAULT_SECTION_TITLES[step]}
                />
              </SortableItem>
            ))}
          </SortableList>
        </div>
      )}
    </div>
  );
}
