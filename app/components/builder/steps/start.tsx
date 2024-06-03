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
import { Drama, RotateCcw, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/shadcn/SelectInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

type Props = {
  singlePage?: boolean;
};

export function StartStep({ singlePage = false }: Props) {
  const { control, watch, setValue } = useFormContext<ResumeValues>();

  const order = watch("meta.order") as Step[];
  const mode = watch("meta.mode");
  const { t } = useTranslation();

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      setValue("meta.order", arrayMoveImmutable(order, oldIndex, newIndex), {
        shouldDirty: true,
      });
    },
    [order, setValue]
  );

  return (
    <div className="space-y-2">
      <Alert className="bg-blue-100">
        <Drama className="h-4 w-4" />
        <AlertTitle>{t("start.recruiter_mode_title")}</AlertTitle>
        <AlertDescription>
          <div className="flex justify-between items-center">
            <span>{t("start.recruiter_mode_desc")}</span>
            <FormField
              control={control}
              name="meta.maskBasics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </AlertDescription>
      </Alert>
      <h4 className="font-semibold flex justify-between items-center">
        <span>{t("base.template")}</span>
      </h4>
      <div className="flex gap-2 items-center">
        <SelectInput
          className="w-full text-black"
          control={control}
          options={[
            { label: "Chicago", value: "chicago" },
            { label: "Admin executive", value: "executive" },
            { label: "Accountant WIP", value: "accountant" },
          ]}
          name="meta.template"
        />
      </div>

      <h4 className="font-semibold flex justify-between items-center">
        <span>{t("start.sections")}</span>
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
            <span>{t("start.use_defaults")}</span>
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
            <span>{t("start.configure_sections")}</span>
          </Button>
        )}
      </h4>
      {singlePage === false && (
        <p className="muted">{t("start.configure_sections_desc")}</p>
      )}

      {mode === "custom" && (
        <div className="space-y-2 text-xs sm:text-sm">
          <ul>
            {singlePage === false && <li>{t("start.li1")}</li>}
            <li>{t("start.li2")}</li>
            <li>{t("start.li3")}</li>
          </ul>
          {singlePage == false && <p>{t("start.come_back")}</p>}
          <br />
          <SortableList
            lockAxis="y"
            onSortEnd={onSortEnd}
            useDragHandle
            className="space-y-3"
          >
            {order.map((step, index) => (
              <SortableItem index={index} key={step}>
                {step !== "basics" && step !== "summary" ? (
                  <SortableHandle />
                ) : (
                  <div className="w-4" />
                )}

                <FormField
                  key={step}
                  control={control}
                  name={`meta.steps.${step}.enabled`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-16 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {step !== "basics" && step !== "summary" ? (
                  <TextInput
                    className="flex-grow"
                    control={control}
                    name={`meta.steps.${step}.title`}
                    placeholder={DEFAULT_SECTION_TITLES[step]}
                  />
                ) : (
                  <Input
                    readOnly
                    disabled
                    className="flex-grow"
                    defaultValue={DEFAULT_SECTION_TITLES[step]}
                  />
                )}
              </SortableItem>
            ))}
          </SortableList>
        </div>
      )}
    </div>
  );
}
