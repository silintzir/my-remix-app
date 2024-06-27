import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lang, Step } from "@/lib/types";
import { type FetcherWithComponents } from "@remix-run/react";
import { Loader2, Plus, RotateCw, Wand2 } from "lucide-react";
import { get, filter, map, range } from "lodash-es";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { useCallback, useState } from "react";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: can be used by education, experience skills, etc so we cannot be sure for the format.
  context: any;
  fetcher: FetcherWithComponents<{ results: string[] }>;
  endpoint: Step;
  append: (texts: string[]) => void;
  label: string;
  lang?: Lang;
};

export function TextSuggestions({
  context,
  fetcher,
  endpoint,
  append,
  label,
  lang = "en",
}: Props) {
  const results = get(fetcher.data, "results", []);

  const [picked, setPicked] = useState<number[]>([]);

  const generate = useCallback(() => {
    setPicked([]);
    fetcher.submit(
      { context: JSON.stringify(context), lang },
      { method: "post", action: `/ai/${endpoint}` }
    );
  }, [fetcher, context, endpoint, lang]);

  const insert = useCallback(() => {
    const newBullets = map(picked, (p) => results[p].replace(/\.$/, ""));
    append(newBullets);
  }, [picked, append, results]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={endpoint === "skills" ? "outline" : "link"}
          className="text-orange-600 font-semibold"
          type="button"
          size="sm"
          onClick={generate}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle>Suggestions</SheetTitle>
          <SheetDescription>
            Pick one or more suggestions from the AI
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto flex-grow">
          {fetcher.state === "submitting" && (
            <div className="space-y-8">
              {range(5).map((i) => (
                <div key={i} className="flex justify-start">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {fetcher.state === "idle" && results.length > 0 && (
            <ul className="space-y-2 w-full text-sm ml-0 list-none">
              {results.map((result, index) => {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: these are not going to be ever resorted
                  <li key={index}>
                    <Label
                      className="flex justify-start items-start bg-muted p-2 rounded-md cursor-pointer gap-2 select-none"
                      htmlFor={`suggestion-${index}`}
                    >
                      <Checkbox
                        id={`suggestion-${index}`}
                        value={index}
                        className="mt-0.5"
                        checked={picked.includes(index)}
                        onCheckedChange={(val) => {
                          if (val) {
                            setPicked([...picked, index]);
                          } else {
                            setPicked(filter(picked, (v) => v !== index));
                          }
                        }}
                      />
                      {result ? result.replace(/\.$/, "") : result}
                    </Label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <SheetFooter className="gap-2">
          <SheetClose disabled={picked.length === 0} className="w-full">
            <Button
              disabled={picked.length === 0}
              onClick={insert}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add selected
            </Button>
          </SheetClose>
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={generate}
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 mr-2" />
                <span>Generate new</span>
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
