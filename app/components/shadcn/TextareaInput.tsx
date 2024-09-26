import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { TextAlternatives } from "./TextAlternatives";
import type { FetcherWithComponents } from "@remix-run/react";
import { Textarea } from "@/components/ui/textarea";
import type { Step } from "@/lib/types";
import { AutosizeTextarea } from "./AutosizeTextarea";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  description?: ReactNode;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  type?: string;
  rows?: number;
  alternatives?: {
    fetcher: FetcherWithComponents<{ results: string[] }>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    context: any;
    endpoint: Step;
    size?: "small" | "large";
  };
};
export function TextareaInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  className = "w-full",
  rows = 2,
  alternatives,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <AutosizeTextarea
                placeholder={placeholder}
                maxHeight={200}
                {...field}
                className={cn({ "pr-12": !!alternatives })}
              />
              {alternatives && (
                <div
                  className={cn(
                    "absolute right-4 top-2.5 opacity-60 hover:opacity-100 text-blue-600"
                  )}
                >
                  <TextAlternatives
                    {...alternatives}
                    update={(alternative: string) =>
                      field.onChange(alternative)
                    }
                    original={field.value}
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
