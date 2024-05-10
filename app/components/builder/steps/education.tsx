import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { EducationRecord, ResumeValues } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { Bullets } from "../bullets";
import { Separator } from "@/components/ui/separator";
import { TextInput } from "@/components/shadcn/TextInput";
import { getEducationTitle, getMonthOptions, getRecordPeriod2, getYearOptions } from "@/lib/resume";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getComparableEndDate } from "@/lib/templates/helpers/common";
import { SelectInput } from "@/components/shadcn/SelectInput";
import { Checkbox } from "@/components/ui/checkbox";

export function EducationStep() {
  const { control, setValue, watch } = useFormContext<ResumeValues>();
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

  const sortFn = (index: number, expr: EducationRecord, autoSort: boolean) => {
    if (autoSort) {
      for (let i = 0; i < fields.length; i++) {
        if (i < index) {
          // convert dates
          // const dateA = convertDate(fields[i].endDate);
          const dateA = getComparableEndDate(fields[i]);
          const dateB = getComparableEndDate(expr);

          if (dateA < dateB) {
            setValue(`resume.education.${index}.endMonth`, expr.endMonth, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.startMonth`, expr.startMonth, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.endYear`, expr.endYear, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.startYear`, expr.startYear, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.toPresent`, expr.toPresent, {
              shouldDirty: true,
            });
            swap(i, index);
            return;
          }
        } else if (i > index) {
          const dateA = getComparableEndDate(fields[i]);
          const dateB = getComparableEndDate(expr);

          if (dateA > dateB) {
            setValue(`resume.education.${index}.endMonth`, expr.endMonth, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.startMonth`, expr.startMonth, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.endYear`, expr.endYear, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.startYear`, expr.startYear, {
              shouldDirty: true,
            });
            setValue(`resume.education.${index}.toPresent`, expr.toPresent, {
              shouldDirty: true,
            });
            swap(i, index);
            return;
          }
        }
      }
    }

    // setValue(`resume.education.${index}.endDate`, expr, {
    //   shouldDirty: true,
    // });
  };

  return (
    <div className="space-y-4">
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
          {fields.map((field, index) => {

            const toPresent = watch(`resume.education.${index}.toPresent`);
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
                        {getEducationTitle(field)}
                      </div>
                      <div className="muted">{getRecordPeriod2(field)}</div>
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
                        name={`resume.education.${index}.city`}
                        label="Location"
                        placeholder="e.x. Miami, FL"
                      />
                    </div>
                    <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                      <TextInput
                        control={control}
                        name={`resume.education.${index}.area`}
                        placeholder="e.x. Business management"
                        label="Area of studies"
                      />
                      <TextInput
                        control={control}
                        name={`resume.education.${index}.studyType`}
                        placeholder="e.x. Bachelor's"
                        label="Degree"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:flex-8 flex-wrap sm:flex-nowrap">
                      <div className="flex gap-2 flex-grow">
                        <SelectInput label="Start (month/year)" className="w-32" control={control} name={`resume.education.${index}.startMonth`} options={getMonthOptions()} onChange={(val) => {
                          sortFn(index, { ...fields[index], startMonth: val }, autoSort)
                        }} />
                        <SelectInput label="Start year" className="w-32" labelHidden control={control} name={`resume.education.${index}.startYear`} options={getYearOptions()} onChange={(val) => sortFn(index, { ...fields[index], startYear: val }, autoSort)} />
                      </div>
                      <span className="self-center font-bold">Until</span>
                      <div className="flex gap-2 flex-grow justify-end">
                        <SelectInput label="End month/year" disabled={toPresent} control={control} className="w-32" name={`resume.education.${index}.endMonth`} options={getMonthOptions()} onChange={(val) => sortFn(index, { ...fields[index], endMonth: val }, autoSort)} />
                        <SelectInput disabled={toPresent} onChange={(val) => sortFn(index, { ...fields[index], endYear: val }, autoSort)} label={<span className="flex justify-end h-5 items-center gap-2" >

                          <FormField
                            control={control}
                            name={`resume.education.${index}.toPresent`}
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormLabel className="font-normal">
                                  To present
                                </FormLabel>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(val) => {
                                      field.onChange(val);
                                      sortFn(index, { ...fields[index], toPresent: !!val }, autoSort)
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                        </span>} className="w-32" control={control} name={`resume.education.${index}.endYear`} options={getYearOptions()} />
                      </div>
                    </div>
                    <Separator />
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    <Bullets
                      index={index}
                      context={field as any}
                      step="education"
                    />
                  </AccordionContent>
                </AccordionItem>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  title="Delete entry"
                  size="sm"
                  onClick={() => {
                    console.log(index);
                    remove(index);
                  }}
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
              startMonth: "-",
              startYear: "-",
              toPresent: false,
              endMonth: "-",
              endYear: "-",
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      if (fields.length) {
                        sortFn(0, fields[0], true);
                      }
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
