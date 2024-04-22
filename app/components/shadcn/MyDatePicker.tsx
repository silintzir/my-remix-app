import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, type ReactNode, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { some, isFinite } from "lodash-es";

const MyDatePicker = (ReactDatePicker as any).default;

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  description?: ReactNode;
  label?: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
  showToPresent?: boolean;
};

export function DatePicker<T extends FieldValues>({
  control,
  name,
  description,
  label,
  className = "w-full",
  onChange,
  showToPresent = false,
}: Props<T>) {
  const { watch } = useFormContext<T>();
  const [current, setCurrent] = useState<Date | null>(null);
  const [disabled, setDisabled] = useState(false);

  const c = watch(name);
  useEffect(() => {
    if (!current && c && c !== "Present") {
      const parts = c.split("/");

      if (some(parts, (p) => !isFinite(+p))) {
        setCurrent(null);
        return;
      }

      // Extract month and year
      const month = parts.length === 1 ? 1 : parseInt(parts[0], 10); // Parse the month as an integer
      const year =
        parts.length === 1 ? parseInt(parts[0], 10) : parseInt(parts[1], 10); // Parse the year as an integer

      // Create a new Date object
      // Note: Months in JavaScript Date object are 0-based, so subtract 1 from the month
      const date = new Date(year, month - 1, 1);
      setCurrent(date);
    }
  }, [c, current]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="flex justify-between items-center h-5">
              {label}
              {showToPresent && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={c === "Present"}
                    onCheckedChange={(value) => {
                      setDisabled(value as boolean);
                      if (value) {
                        field.onChange("Present");
                        onChange && onChange("Present");
                      } else {
                        field.onChange("");
                        onChange && onChange("");
                      }
                      setCurrent(null);
                    }}
                  />
                  <Label>Present</Label>
                </div>
              )}
            </FormLabel>
          )}
          <div className="w-full">
            <MyDatePicker
              showIcon
              className="w-full"
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="MM/YYYY"
              disabled={disabled}
              selected={current}
              isClearable
              customInput={<Input className="w-full" />}
              onChange={(value: Date) => {
                if (value) {
                  setCurrent(value);
                  const month = value.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
                  const year = value.getFullYear();
                  // Format the date as MM/YYYY
                  const formattedDate = `${month
                    .toString()
                    .padStart(2, "0")}/${year}`;
                  field.onChange(formattedDate);
                  if (onChange) {
                    onChange(formattedDate);
                  }
                } else {
                  setCurrent(null);
                  field.onChange("");
                }
              }}
            />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
