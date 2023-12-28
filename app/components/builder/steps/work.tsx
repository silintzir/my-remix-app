import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { MonthPicker } from "@/components/month-picker";
import { SelectInput } from "@/components/shadcn/SelectInput";
import { TextInput } from "@/components/shadcn/TextInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getExperienceTitle, getRecordPeriod } from "@/lib/resume";
import { usStateCodes } from "@/lib/states";
import type { ResumeValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { map, orderBy } from "lodash-es";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { Bullets } from "../bullets";
import { InputMask } from "@/components/ui/input-mask";
import { SectionRename } from "../section-rename";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";

export function WorkStep() {
  const { control, setValue, watch } = useFormContext<ResumeValues>();
  const [open, setOpen] = useState("");

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.work",
  });

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    swap(oldIndex, newIndex);
  };

  const autoSort = watch("meta.autoSort.work");

  const sorted = autoSort ? orderBy(fields, ["endDate"]) : fields;

  return (
    <>
      <div className="space-y-4">
        {fields.length === 0 ? (
          <p className="small">
            If you do not wish to enter any experience, continue to the next
            step.
          </p>
        ) : (
          <p className="small">
            You may keep adding as many work experience entries and reorder as
            needed
          </p>
        )}

        <SortableList
          lockAxis="y"
          onSortEnd={onSortEnd}
          useDragHandle
          value={open}
        >
          <Accordion
            value={open}
            type="single"
            className="space-y-1"
            collapsible
          >
            {sorted.map((field, index) => {
              return (
                <SortableItem
                  index={index}
                  key={field.uuid}
                  className="w-full flex items-center gap-2"
                >
                  {autoSort !== true && fields.length > 1 && <SortableHandle />}
                  <AccordionItem
                    value={field.uuid}
                    className="border-2 border-bg-gray-500 bg-white px-4 rounded-md data-[state=open]:border-primary data-[state=open]:bg-muted w-full"
                  >
                    <AccordionTrigger
                      className="flex py-3 justify-end gap-4 hover:no-underline"
                      onClick={() =>
                        setOpen(open === field.uuid ? "" : field.uuid)
                      }
                    >
                      <div className="flex-grow text-left small space-y-2">
                        <div className="font-semibold hover:underline">
                          {getExperienceTitle(field)}
                        </div>
                        <div className="muted">{getRecordPeriod(field)}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 mt-2 px-1">
                      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                        <TextInput
                          control={control}
                          name={`resume.work.${index}.name`}
                          placeholder="e.x. ABC Company"
                          label="Company/Employer"
                        />
                        <TextInput
                          control={control}
                          name={`resume.work.${index}.position`}
                          placeholder="e.x. Accountant"
                          label="Job title/Position"
                        />
                      </div>
                      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                        <div className="flex gap-2 w-full sm:flex-8 flex-wrap sm:flex-nowrap">
                          <FormField
                            control={control}
                            name={`resume.work.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="inline-flex gap-2 items-center">
                                  <span>Start date</span>
                                  <MonthPicker
                                    currentValue={field.value}
                                    setValue={(expr: string) => {
                                      setValue(
                                        `resume.work.${index}.startDate`,
                                        expr,
                                        {
                                          shouldDirty: true,
                                        }
                                      );
                                    }}
                                  />
                                </FormLabel>
                                <FormControl>
                                  <InputMask
                                    placeholder="MM/YYYY"
                                    {...field}
                                    mask="99/9999"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`resume.work.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="inline-flex gap-2 items-center">
                                  <span>End date</span>
                                  <MonthPicker
                                    currentValue={field.value}
                                    setValue={(expr: string) => {
                                      setValue(
                                        `resume.work.${index}.endDate`,
                                        expr,
                                        {
                                          shouldDirty: true,
                                        }
                                      );
                                    }}
                                    toPresent
                                    toPresentText="Currently work here"
                                  />
                                </FormLabel>
                                <FormControl>
                                  <InputMask
                                    placeholder="MM/YYYY"
                                    {...field}
                                    mask="99/9999"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex gap-2 w-full sm:flex-8">
                          <TextInput
                            control={control}
                            name={`resume.work.${index}.city`}
                            placeholder="e.x. Miami"
                            label="City"
                          />
                          <SelectInput
                            className="w-48"
                            options={map(usStateCodes, (s) => ({
                              label: s,
                              value: s,
                            }))}
                            control={control}
                            name={`resume.work.${index}.state`}
                            label="State"
                            placeholder="Select state"
                          />
                        </div>
                      </div>
                      <Separator />
                      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                      <Bullets
                        index={index}
                        context={field as any}
                        step="work"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    title="Delete entry"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </SortableItem>
              );
            })}
          </Accordion>
        </SortableList>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="text-blue-600 font-semibold"
            type="button"
            size="sm"
            onClick={() => {
              const id = uuid();
              append({
                uuid: id,
                name: "",
                position: "",
                city: "",
                state: "",
                startDate: "",
                endDate: "",
                bullets: [],
              });
              setOpen(id);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add work experience
          </Button>
          <FormField
            control={control}
            name="meta.autoSort.work"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-1 space-y-0">
                <FormLabel className={cn({ muted: fields.length < 2 })}>
                  Auto sort by date
                </FormLabel>
                <FormControl>
                  <Switch
                    disabled={fields.length < 2}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      <SectionRename
        name="meta.steps.work.title"
        placeholder={DEFAULT_SECTION_TITLES.work}
      />
    </>
  );
}
