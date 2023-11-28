import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, type Path, useFormContext } from "react-hook-form";
import { useClickAway } from "@uidotdev/usehooks";
import type { ResumeValues } from "@/lib/types";

type Props<T extends ResumeValues> = {
  name: Path<T>;
  defaultValue: string;
  showEditIcon?: boolean;
  className?: string;
  maxLength?: number;
  title?: string;
};

export function InlineEdit<T extends ResumeValues>({
  maxLength = 32,
  defaultValue,
  name,
  showEditIcon = false,
  className = "",
  title = "Rename"
}: Props<T>) {

  const { control } = useFormContext<ResumeValues>();
  const [edit, setEdit] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const ref = useClickAway<HTMLInputElement>(() => {
    setEdit(false);
  });

  const handleResize = () => {
    if (spanRef?.current) {
      spanRef.current.textContent = ref.current.value;
      ref.current.style.width = `${spanRef.current.offsetWidth + 5}px`
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => { handleResize() }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleClick = useCallback(() => {
    setEdit(true);
    ref.current?.select();
  }, []);

  return (
    <div className="flex gap-1 items-center">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            <span ref={spanRef} className="invisible whitespace-pre absolute left-0" />
            <input
              type="text"
              {...field}
              maxLength={maxLength}
              ref={ref}
              onClick={handleClick}
              onChange={(evt) => {
                if (evt.currentTarget.value.trim().length === 0) {
                  evt.currentTarget.value = defaultValue;
                }
                field.onChange(evt);
                handleResize();
              }}
              className={cn(
                className,
                "bg-transparent outline-none placeholder-current border-2 border-transparent w-fit",
                edit
                  ? "bg-white border-b-2 border-b-blue-600 placeholder-gray-400 rounded-t-md"
                  : ""
              )}
              placeholder={defaultValue}
              readOnly={!edit}
            />
          </div>
        )}
      />
      {showEditIcon && (
        <button
          className="opacity-60 hover:opacity-100"
          type="button"
          title={title}
          disabled={edit}
          onClick={handleClick}
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
