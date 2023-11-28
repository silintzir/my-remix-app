import { useState, useCallback, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type Props = {
  currentValue: string | undefined;
  setValue: (expr: string) => void;
  toPresent?: boolean;
  toPresentText?: string;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthPicker({
  setValue,
  currentValue,
  toPresent = false,
  toPresentText = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const increaseYear = useCallback(
    () => setYear(Math.min(year + 1, 2030)),
    [year]
  );
  const decreaseYear = useCallback(
    () => setYear(Math.max(year - 1, 1970)),
    [year]
  );

  const toks =
    currentValue && typeof currentValue === "string"
      ? currentValue.split("/")
      : [];

  const cm = toks[0] ? toks[0] : "";

  const popRef = useRef<HTMLDivElement>(null);
  const triRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popRef?.current &&
        !popRef.current.contains(event.target as Node) &&
        triRef.current &&
        !triRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Popover open={open}>
      <PopoverTrigger ref={triRef} onClick={() => setOpen(true)}>
        <CalendarIcon className="w-4 h-4 opacity-70 hover:opacity-100" />
      </PopoverTrigger>
      <PopoverContent>
        <div ref={popRef} className="space-y-2">
          <div className="flex justify-between items-center">
            <button onClick={decreaseYear} type="button">
              <ChevronLeft className="w-5 h-5 opacity-70 hover:opacity-100" />
            </button>
            <Button
              variant={currentValue === year.toString() ? "default" : "outline"}
              onClick={() => {
                setValue(year.toString());
                setOpen(false);
              }}
            >
              {year}
            </Button>
            <button onClick={increaseYear} type="button">
              <ChevronRight className="w-5 h-5 opacity-70 hover:opacity-100" />
            </button>
          </div>
          <div
            className="grid w-full gap-2"
            style={{
              gridTemplateRows: "1fr 1fr 1fr",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
            }}
          >
            {months.map((month, index) => (
              <Button
                key={month}
                variant={cm === month ? "default" : "outline"}
                className={cn({
                  "font-semibold": cm === month,
                })}
                onClick={() => {
                  setValue(`${String(index + 1).padStart(2, "0")}/${year}`);
                  setOpen(false);
                }}
              >
                {month}
              </Button>
            ))}
          </div>
          {toPresent && (
            <div className="flex items-center justify-center space-x-2">
              <Switch
                id="toPresent"
                defaultChecked={currentValue?.toLowerCase() === "present"}
                onCheckedChange={(value) => {
                  if (value) {
                    setValue("Present");
                  } else {
                    setValue("");
                  }
                }}
              />
              <Label htmlFor="toPresent">{toPresentText}</Label>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
