import { Button } from "@/components/ui/button";
import type { AccomplishmentRecord, ResumeValues } from "@/lib/types";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { TextInput } from "@/components/shadcn/TextInput";
import { map } from "lodash-es";
import {
  SortableContainer,
  SortableElement,
  SortableHandle as Handle,
} from "react-sortable-hoc";
import type { ReactNode } from "react";
import { useFetcher } from "@remix-run/react";
import { useAiContext } from "@/components/hooks/aiContext";
import { TextSuggestions } from "@/components/shadcn/TextSuggestions";
import { StepHeader } from '@/components/builder/header';

type SProps = {
  children: ReactNode;
};

const SortableList = SortableContainer(({ children }: SProps) => {
  return <ul className="list-none ml-0 py-2">{children}</ul>;
}) as any;
const SortableHandle = Handle(() => (
  <button type="button">
    <GripVertical className="w-6 h-6" />
  </button>
));
const SortableItem = SortableElement(({ children }: SProps) => {
  return <li className="flex gap-1 items-center">{children}</li>;
}) as any;

export function AccomplishmentsStep() {
  const { control } = useFormContext<ResumeValues>();

  const enhancer = useFetcher<{ results: string[] }>({ key: "accomplishments-enhance" });
  const suggester = useFetcher<{ results: string[] }>({ key: "accomplishments-suggest" });

  const getContext = useAiContext();

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "resume.accomplishments",
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
      <StepHeader step="work" />
      {fields.length === 0 ? (
        <p className="small">
          If you do not wish to enter any accomplishments, continue to the next
          step.
        </p>
      ) : (
        <p className="small">
          You may keep adding as many accomplishments and reorder as needed.
        </p>
      )}
      {fields.length > 0 && (
        <SortableList lockAxis="y" onSortEnd={onSortEnd} useDragHandle>
          {fields.map((field, index) => {
            return (
              <SortableItem key={field.uuid} index={index} className="flex">
                <SortableHandle />
                <TextInput
                  className="w-full"
                  control={control}
                  name={`resume.accomplishments.${index}.name`}
                  placeholder="Something you are proud of"
                  alternatives={{
                    fetcher: enhancer,
                    context: getContext({
                      step: "accomplishments",
                      uuid: field.uuid,
                    }),
                    endpoint: "accomplishments",
                  }}
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
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add accomplishment
        </Button>
        <TextSuggestions
          fetcher={suggester}
          context={getContext()}
          append={(texts: string[]) => {
            const newAccomplishments: AccomplishmentRecord[] = map(
              texts,
              (name) => ({
                uuid: uuid(),
                name,
              })
            );
            append(newAccomplishments);
          }}
          endpoint="accomplishments"
          label="Suggest accomplishments"
        />
      </div>
    </div>
  );
}
