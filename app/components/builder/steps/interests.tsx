import { Button } from "@/components/ui/button";
import type { InterestRecord, ResumeValues } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { TextInput } from "@/components/shadcn/TextInput";
import { map } from "lodash-es";
import { useFetcher } from "@remix-run/react";
import { useAiContext } from "@/components/hooks/aiContext";
import { TextSuggestions } from "@/components/shadcn/TextSuggestions";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { useTranslation } from "react-i18next";

export function InterestsStep() {
  const { control, watch } = useFormContext<ResumeValues>();
  const lang = watch("meta.language");

  const enhancer = useFetcher<{ results: string[] }>({
    key: "interests-enhance",
  });
  const suggester = useFetcher<{ results: string[] }>({
    key: "interests-suggest",
  });

  const getContext = useAiContext();

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.interests",
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
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <p className="small">{t("interests.no_wish")}</p>
      ) : (
        <p className="small">{t("interests.you_may_add")}</p>
      )}
      {fields.length > 0 && (
        <SortableList
          lockAxis="y"
          onSortEnd={onSortEnd}
          useDragHandle
          className="space-y-1"
        >
          {fields.map((field, index) => {
            return (
              <SortableItem key={field.uuid} index={index} className="flex">
                <SortableHandle />
                <TextInput
                  className="w-full"
                  control={control}
                  name={`resume.interests.${index}.name`}
                  placeholder={t("interests.placeholder")}
                  alternatives={{
                    fetcher: enhancer,
                    context: getContext({
                      step: "interests",
                      uuid: field.uuid,
                    }),
                    endpoint: "interests",
                    lang,
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  title={t("builder.delete_entry")}
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </SortableItem>
            );
          })}
        </SortableList>
      )}
      <div className="flex gap-1">
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
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("interests.add_new")}
        </Button>
        <TextSuggestions
          fetcher={suggester}
          context={getContext()}
          append={(texts: string[]) => {
            const newInterests: InterestRecord[] = map(texts, (name) => ({
              uuid: uuid(),
              name,
            }));
            append(newInterests);
          }}
          endpoint="interests"
          label={t("interests.suggest")}
          lang={lang}
        />
      </div>
    </div>
  );
}
