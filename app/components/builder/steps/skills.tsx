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
import { StepHeader } from '@/components/builder/header';
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/components/builder/sortable";



export function SkillsStep() {
  const { control } = useFormContext<ResumeValues>();

  const enhancer = useFetcher<{ results: string[] }>({ key: "skills-enhance" });
  const suggester = useFetcher<{ results: string[] }>({ key: "skills-suggest" });

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
      <StepHeader step="skills" />
      {fields.length === 0 ? (
        <p className="small">
          If you do not wish to enter any skills, continue to the next step.
        </p>
      ) : (
        <p className="small">
          You may keep adding as many skills and reorder as needed.
        </p>
      )}
      {fields.length > 0 && (
        <SortableList lockAxis="y" onSortEnd={onSortEnd} useDragHandle className="space-y-1">
          {fields.map((field, index) => {
            return (
              <SortableItem key={field.uuid} index={index} className="flex">
                <SortableHandle />
                <TextInput
                  className="w-full"
                  control={control}
                  name={`resume.skills.${index}.name`}
                  placeholder="Skill name"
                  alternatives={{
                    fetcher: enhancer,
                    context: getContext({ step: "skills", uuid: field.uuid }),
                    endpoint: "skills",
                  }}
                />
                <SelectInput
                  className="w-64"
                  control={control}
                  name={`resume.skills.${index}.level`}
                  options={getSkillLevelOptions()}
                />
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
              level: "no_mention",
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add skill
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
          label="Suggest skills"
        />
      </div>
    </div>
  );
}
