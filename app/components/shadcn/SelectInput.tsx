import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { ReactNode } from "react";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: Array<{ label: string; value: string }>;
  description?: ReactNode;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
};

export function SelectInput<T extends FieldValues>({
  control,
  name,
  options,
  description,
  label,
  placeholder,
  className = "w-full",
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
