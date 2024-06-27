import { SelectInput } from "@/components/shadcn/SelectInput";
import { TextInput } from "@/components/shadcn/TextInput";
import { Button } from "@/components/ui/button";
import type { ResumeValues, SkillRecord } from "@/lib/types";
import { map } from "lodash-es";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { useAiContext } from "@/components/hooks/aiContext";
import { TextSuggestions } from "@/components/shadcn/TextSuggestions";
import { getSkillLevelOptions } from "@/lib/resume";
import { useFetcher } from "@remix-run/react";
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";
import { useTranslation } from "react-i18next";

export function SkillsStep() {
  const { control, watch } = useFormContext<ResumeValues>();
  const lang = watch("meta.language");

  const enhancer = useFetcher<{ results: string[] }>({ key: "skills-enhance" });
  const suggester = useFetcher<{ results: string[] }>({
    key: "skills-suggest",
  });

  const { t } = useTranslation();
  const getContext = useAiContext();

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.skills",
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

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <p className="small">{t("skills.no_wish")}</p>
      ) : (
        <p className="small">{t("skills.you_may_add")}</p>
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
              <SortableItem
                key={field.uuid}
                index={index}
                className="flex flex-wrap sm:flex-nowrap"
              >
                <SortableHandle />
                <TextInput
                  className="w-full"
                  control={control}
                  name={`resume.skills.${index}.name`}
                  placeholder={t("skills.placeholder")}
                  alternatives={{
                    fetcher: enhancer,
                    context: getContext({ step: "skills", uuid: field.uuid }),
                    endpoint: "skills",
                    lang,
                  }}
                />
                <SelectInput
                  control={control}
                  name={`resume.skills.${index}.level`}
                  options={getSkillLevelOptions(t)}
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
      <div className="flex gap-1 flex-wrap sm:flex-nowrap">
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
              level: "no_mention",
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("skills.add_new")}
        </Button>
        <TextSuggestions
          fetcher={suggester}
          context={getContext()}
          append={(texts: string[]) => {
            const newSkills: SkillRecord[] = map(texts, (name) => ({
              uuid: uuid(),
              name,
              level: "no_mention",
            }));
            append(newSkills);
          }}
          endpoint="skills"
          label={t("skills.suggest_skills")}
          lang={lang}
        />
      </div>
    </div>
  );
}
