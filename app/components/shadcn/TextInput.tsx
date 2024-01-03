import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { InputMask } from "../ui/input-mask";
import { cn } from "@/lib/utils";
import { TextAlternatives } from "./TextAlternatives";
import type { FetcherWithComponents } from "@remix-run/react";
import type { Lang, Step } from "@/lib/types";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  description?: ReactNode;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  type?: string;
  inputMask?: string;
  alternatives?: {
    fetcher: FetcherWithComponents<{ results: string[] }>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    context: any;
    endpoint: Step;
    lang: Lang;
  };
};
export function TextInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className = "w-full",
  type = "text",
  alternatives,
  inputMask,
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
              {inputMask ? (
                <InputMask
                  type={type}
                  mask={inputMask}
                  placeholder={placeholder}
                  {...field}
                  className=""
                />
              ) : (
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  className={cn({ "pr-12": !!alternatives })}
                />
              )}
              {alternatives && (
                <div className="absolute right-4 top-2.5 opacity-60 hover:opacity-100 text-blue-600">
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
