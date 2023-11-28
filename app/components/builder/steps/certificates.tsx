import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCertificateTitle } from "@/lib/resume";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { MonthPicker } from "@/components/month-picker";
import { Separator } from "@/components/ui/separator";
import { TextInput } from "@/components/shadcn/TextInput";
import { AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { ResumeValues } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { orderBy } from "lodash-es";
import { useState } from "react";
import {
  SortableAccordionHandle,
  SortableAccordionItem,
  SortableAccordionList,
} from "@/components/builder/sortable-accordions";
import { cn } from "@/lib/utils";
import { StepHeader } from "@/components/builder/header";

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

  const sorted = autoSort ? orderBy(fields, ["date"]) : fields;

  return (
    <div className="space-y-4">
      <StepHeader step="certificates" />
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
      <SortableAccordionList
        lockAxis="y"
        onSortEnd={onSortEnd}
        useDragHandle
        value={open}
      >
        {sorted.map((field, index) => {
          return (
            <SortableAccordionItem
              index={index}
              key={field.uuid}
              value={field.uuid}
              className="flex"
            >
              <AccordionTrigger
                className="flex py-3 justify-end gap-4"
                onClick={() => setOpen(open === field.uuid ? "" : field.uuid)}
              >
                {autoSort !== true && fields.length > 1 && (
                  <SortableAccordionHandle />
                )}
                <div className="flex-grow text-left small space-y-2">
                  <div className="font-semibold flex flex-col gap-1">
                    <span>{getCertificateTitle(field)}</span>
                    <span className="font-normal">
                      {field.date || "No date"}
                    </span>
                  </div>
                </div>

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
                            <Input placeholder="MM/YYYY" {...field} />
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
            </SortableAccordionItem>
          );
        })}
      </SortableAccordionList>

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
