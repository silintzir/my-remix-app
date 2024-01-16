import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCertificateTitle } from "@/lib/resume";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { MonthPicker } from "@/components/month-picker";
import { Separator } from "@/components/ui/separator";
import { TextInput } from "@/components/shadcn/TextInput";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import type { ResumeValues } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { cn, getReadableDateFromPicker } from "@/lib/utils";
import { InputMask } from "@/components/ui/input-mask";
import { convertDate } from "@/lib/templates/helpers/common";

export function CertificatesStep() {
  const { control, setValue, watch } = useFormContext<ResumeValues>();
  const [open, setOpen] = useState("");

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.certificates",
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

  const autoSort = watch("meta.autoSort.certificates");

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <p className="small">
          If you do not wish to enter any certificates, continue to the next
          step.
        </p>
      ) : (
        <p className="small">
          You may keep adding as many certificates and reorder as needed.
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
            return (
              <SortableItem
                index={Number(field.uuid)}
                key={field.uuid}
                value={field.uuid}
                className="flex"
              >
                {autoSort !== true && fields.length > 1 && <SortableHandle />}
                <AccordionItem
                  value={field.uuid}
                  className="border-2 border-bg-gray-500 bg-white px-4 rounded-md data-[state=open]:border-gray-600 data-[state=open]:bg-muted w-full"
                >
                  <AccordionTrigger
                    className="flex py-3 justify-end gap-4 hover:no-underline"
                    onClick={() =>
                      setOpen(open === field.uuid ? "" : field.uuid)
                    }
                  >
                    <div className="flex-grow text-left small">
                      <div className="font-semibold flex flex-col gap-2">
                        <span className="hover:underline">
                          {getCertificateTitle(field)}
                        </span>
                        <span className="font-normal">
                          {field.date
                            ? getReadableDateFromPicker(field.date)
                            : "No date"}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 mt-2 px-1">
                    <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                      <TextInput
                        control={control}
                        name={`resume.certificates.${index}.name`}
                        placeholder="e.x. "
                        label="Certificate"
                      />
                      <TextInput
                        control={control}
                        name={`resume.certificates.${index}.issuer`}
                        placeholder="e.x. Business management"
                        label="Issuing authority"
                      />
                    </div>
                    <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
                      <div className="flex gap-2 w-full sm:flex-8 flex-wrap sm:flex-nowrap">
                        <FormField
                          control={control}
                          name={`resume.certificates.${index}.date`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="inline-flex gap-2 items-center">
                                <span>Date</span>
                                <MonthPicker
                                  currentValue={field.value}
                                  setValue={(expr: string) => {
                                    if (autoSort) {
                                      for (let i = 0; i < fields.length; i++) {
                                        if (i < index) {
                                          // convert dates
                                          const dateA = convertDate(
                                            fields[i].date
                                          );
                                          const dateB = convertDate(expr);
                                          if (dateA > dateB) {
                                            setValue(
                                              `resume.certificates.${index}.date`,
                                              expr,
                                              {
                                                shouldDirty: true,
                                              }
                                            );
                                            swap(i, index);
                                            return;
                                          }
                                        } else if (i > index) {
                                          const dateA = convertDate(
                                            fields[i].date
                                          );
                                          const dateB = convertDate(expr);
                                          if (dateA < dateB) {
                                            setValue(
                                              `resume.certificates.${index}.date`,
                                              expr,
                                              {
                                                shouldDirty: true,
                                              }
                                            );
                                            swap(i, index);
                                            return;
                                          }
                                        }
                                      }
                                    }
                                    setValue(
                                      `resume.certificates.${index}.date`,
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
                                  onChange={(evt) => {
                                    const expr = evt.currentTarget.value;
                                    if (autoSort) {
                                      for (let i = 0; i < fields.length; i++) {
                                        if (i < index) {
                                          // convert dates
                                          const dateA = convertDate(
                                            fields[i].date
                                          );
                                          const dateB = convertDate(expr);
                                          if (dateA > dateB) {
                                            setValue(
                                              `resume.certificates.${index}.date`,
                                              expr,
                                              {
                                                shouldDirty: true,
                                              }
                                            );
                                            swap(i, index);
                                            return;
                                          }
                                        } else if (i > index) {
                                          const dateA = convertDate(
                                            fields[i].date
                                          );
                                          const dateB = convertDate(expr);
                                          if (dateA < dateB) {
                                            setValue(
                                              `resume.certificates.${index}.date`,
                                              expr,
                                              {
                                                shouldDirty: true,
                                              }
                                            );
                                            swap(i, index);
                                            return;
                                          }
                                        }
                                      }
                                    }
                                    setValue(
                                      `resume.certificates.${index}.date`,
                                      expr,
                                      {
                                        shouldDirty: true,
                                      }
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <TextInput
                          control={control}
                          name={`resume.certificates.${index}.url`}
                          placeholder="e.x. Business management"
                          label="URL/Website"
                        />
                      </div>
                    </div>
                    <Separator />
                  </AccordionContent>
                </AccordionItem>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive mr-4"
                  title="Delete entry"
                  size="sm"
                  onClick={() => {
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
              name: "",
              date: "",
              issuer: "",
              url: "",
            });
            setOpen(id);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add certificate
        </Button>
        <FormField
          control={control}
          name="meta.autoSort.certificates"
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
