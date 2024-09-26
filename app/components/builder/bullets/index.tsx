import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import type {
  Bullet,
  Lang,
  RecordWithBullets,
  ResumeValues,
} from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { SortableHandle, SortableList, SortableItem } from "./sortable";
import { map, filter } from "lodash-es";
import { useFetcher } from "@remix-run/react";
import { transformWork, transformEducation } from "@/lib/jsonresume";
import { TextSuggestions } from "@/components/shadcn/TextSuggestions";
import { TextInput } from "@/components/shadcn/TextInput";
import { useTranslation } from "react-i18next";

type Props = {
  index: number;
  context: RecordWithBullets;
  step: "education" | "work";
};
export function Bullets({ step, index, context }: Props) {
  const { control, watch } = useFormContext<ResumeValues>();
  const { t } = useTranslation();

  const lang = watch("meta.language") as Lang;

  const enhancer = useFetcher<{ results: string[] }>({
    key: "bullets-enhance",
  });
  const suggester = useFetcher<{ results: string[] }>({
    key: "bullets-suggest",
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: `resume.${step}.${index}.bullets`,
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

  const List = SortableList;
  const Item = SortableItem;

  const ctx =
    step === "education"
      ? { education: [transformEducation(context as any)] }
      : { work: [transformWork(context as any)] };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap">
        <FormLabel className="font-semibold">
          {t("builder.bullets")} ({fields.length})
        </FormLabel>
        <div className="flex flex-wrap">
          <TextSuggestions
            context={ctx}
            fetcher={suggester}
            append={(texts: string[]) => {
              const newBullets: Bullet[] = map(texts, (content) => ({
                uuid: uuid(),
                content,
              }));
              append(newBullets);
            }}
            endpoint={step}
            label={t("builder.ai_suggest")}
            lang={lang}
          />
          <Button
            size="sm"
            variant="link"
            className="text-blue-600 font-semibold"
            type="button"
            onClick={() => {
              const id = uuid();
              append({
                uuid: id,
                content: "",
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("builder.add_bullet")}
          </Button>
        </div>
      </div>
      <p className="small muted">{t("builder.suggest_bullets")}</p>
      <List lockAxis="y" onSortEnd={onSortEnd} useDragHandle>
        {fields.map((field, index2) => {
          // remove the bullet in question
          context.bullets = filter(
            context.bullets,
            (b) => b.uuid !== field.uuid
          );
          const ctx =
            step === "education"
              ? { education: [transformEducation(context as any)] }
              : { work: [transformWork(context as any)] };

          return (
            <Item key={index2} index={index2}>
              <SortableHandle />
              <TextInput
                autoResize
                control={control}
                name={`resume.${step}.${index}.bullets.${index2}.content`}
                alternatives={{
                  fetcher: enhancer,
                  endpoint: step,
                  context: ctx,
                  lang,
                }}
              />
              <button
                type="button"
                className="h-8 text-red-600"
                onClick={() => remove(index2)}
                title={t("builder.delete_bullet")}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </Item>
          );
        })}
      </List>
    </div>
  );
}
