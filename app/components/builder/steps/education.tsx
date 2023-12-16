import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  getRecordPeriod,
  getEducationTitle,
  getEducationDegreeOptions,
} from "@/lib/resume";
import type { ResumeValues } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { map, orderBy } from "lodash-es";
import { v4 as uuid } from "uuid";
import { MonthPicker } from "@/components/month-picker";
import { Bullets } from "../bullets";
import { Separator } from "@/components/ui/separator";
import { usStateCodes } from "@/lib/states";
import { SelectInput } from "@/components/shadcn/SelectInput";
import { TextInput } from "@/components/shadcn/TextInput";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StepHeader } from '@/components/builder/header';

export function EducationStep() {
  const {
    control,
    setValue,
    watch,
  } = useFormContext<ResumeValues>();
  const [open, setOpen] = useState("");

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.education",
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

  const autoSort = watch("meta.autoSort.education");

  const sorted = autoSort ? orderBy(fields, ["endDate"]) : fields;

  return (
    <div className="space-y-4">
      <StepHeader step="education" />
      {fields.length === 0 ? (
        <p className="small">
          If you do not wish to enter any education, continue to the next step.
        </p>
      ) : (
        <p className="small">
          You may keep adding as many education entries and reorder as needed.
        </p>
      )}
      <SortableList
        lockAxis="y"
        onSortEnd={onSortEnd}
        useDragHandle
        value={open}
      >
        <Accordion value={open} type="single" className="space-y-1" collapsible>
          {sorted.map((field, index) => {
            return (
              <SortableItem index={index} key={field.uuid} className="w-full flex items-center gap-2">
                {autoSort !== true && fields.length > 1 && (
                  <SortableHandle />
                )}
                <AccordionItem
                  value={field.uuid}
                  className="border-2 border-bg-gray-500 bg-white px-4 rounded-md data-[state=open]:border-gray-600 data-[state=open]:bg-muted w-full"
                >
                  <AccordionTrigger
                    className="flex py-3 justify-end gap-4 hover:no-underline"
                    onClick={() => setOpen(open === field.uuid ? "" : field.uuid)}
                  >
                    <div className="flex-grow text-left small space-y-2">
                      <div className="font-semibold hover:underline">
                        {getEducationTitle(field)}
                      </div>
                      <div className="muted">{getRecordPeriod(field)}</div>
                    </div>

                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 mt-2 px-1">
                    <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                      <TextInput
                        control={control}
                        name={`resume.education.${index}.institution`}
                        placeholder="e.x. ABC College"
                        label="College/School"
                      />
                      <TextInput
                        control={control}
                        name={`resume.education.${index}.area`}
                        placeholder="e.x. Business management"
                        label="Area of studies"
                      />
                      <SelectInput
                        control={control}
                        name={`resume.education.${index}.studyType`}
                        label="Degree"
                        placeholder="No mention"
                        options={getEducationDegreeOptions()}
                      />
                    </div>
                    <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                      <div className="flex gap-2 w-full sm:flex-8 flex-wrap sm:flex-nowrap">
                        <FormField
                          control={control}
                          name={`resume.education.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="inline-flex gap-2 items-center">
                                <span>Start date</span>
                                <MonthPicker
                                  currentValue={field.value}
                                  setValue={(expr: string) => {
                                    setValue(
                                      `resume.education.${index}.startDate`,
                                      expr,
                                      {
                                        shouldDirty: true,
                                      }
                                    );
                                  }}
                                />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`resume.education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="inline-flex gap-2 items-center">
                                <span>End date</span>
                                <MonthPicker
                                  currentValue={field.value}
                                  setValue={(expr: string) => {
                                    setValue(
                                      `resume.education.${index}.endDate`,
                                      expr,
                                      {
                                        shouldDirty: true,
                                      }
                                    );
                                  }}
                                  toPresent
                                  toPresentText="Currently studying or anticipating graduation"
                                />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:flex-8">
                        <TextInput
                          control={control}
                          name={`resume.education.${index}.city`}
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
                          name={`resume.education.${index}.state`}
                          label="State"
                          placeholder="Select state"
                        />
                      </div>
                    </div>
                    <Separator />
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    <Bullets index={index} context={field as any} step="education" />
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
              institution: "",
              area: "",
              studyType: "",
              status: "graduated",
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
          Add education
        </Button>
        <FormField
          control={control}
          name="meta.autoSort.education"
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
  );
}
