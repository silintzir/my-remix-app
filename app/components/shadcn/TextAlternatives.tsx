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
import type { FetcherWithComponents } from "@remix-run/react";
import { Loader2, Replace, RotateCw, Wand2 } from "lucide-react";
import { get, range } from "lodash-es";
import { Label } from "@radix-ui/react-label";
import { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Lang, Step } from "@/lib/types";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  context: any;
  fetcher: FetcherWithComponents<{ results: string[] }>;
  original: string;
  endpoint: Step;
  buttonLabel?: string;
  lang?: Lang;
  update: (alternative: string) => void;
};

export function TextAlternatives({
  fetcher,
  context,
  original,
  endpoint,
  update,
  buttonLabel,
  lang = "en",
}: Props) {
  const results = get(fetcher.data, "results", []);

  const [picked, setPicked] = useState<string | null>(null);

  const enhance = useCallback(() => {
    setPicked(null);
    fetcher.submit(
      { context: JSON.stringify(context), original: original || "", lang },
      { method: "post", action: `/ai/${endpoint}` }
    );
  }, [fetcher, original, context, endpoint, lang]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="text-blue-600 flex gap-1 items-center"
          type="button"
          onClick={enhance}
          title="AI Powered rephrase"
        >
          <Wand2 className="h-4 w-4" />
          {buttonLabel && <span>{buttonLabel}</span>}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle>
            {original && original.length > 0 ? (
              <>
                <span>
                  Alternatives for: <br />
                </span>
                <span className="font-semibold text-base">"{original}"</span>
              </>
            ) : (
              <span>
                Suggestions: <br />
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Pick one of suggestions from the AI.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto">
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
            <RadioGroup
              className="text-sm"
              onValueChange={(val) => setPicked(val)}
            >
              {results.map((result, index) => {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-muted rounded-md cursor-pointer"
                  >
                    <RadioGroupItem value={result} id={`r${index}`} />
                    <Label htmlFor={`r${index}`}>
                      {result ? result.replace(/\.$/, "") : result}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </div>
        <SheetFooter className="gap-2">
          <SheetClose disabled={!picked}>
            <Button
              disabled={picked === null}
              onClick={() => update(picked?.replace(/\.$/, "") || original)}
              size="sm"
              className="w-full"
            >
              <Replace className="h-4 w-4 mr-2" />
              Replace with selected
            </Button>
          </SheetClose>
          <Button
            variant="outline"
            size="sm"
            onClick={enhance}
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
