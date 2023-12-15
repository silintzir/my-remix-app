import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import type { Step } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@remix-run/react";
import { Progress } from "@/components/ui/progress";

type Props = {
  steps: Step[];
  current: number;
};
export function Stepper({ steps, current }: Props) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div>
      <div className="hidden sm:block mt-6 mb-8">
        <TooltipProvider>
          <div className="flex items-center mt-2 pl-6">
            {steps.map((step, index) => {
              return (
                <div
                  key={step}
                  className={cn("w-full bg-gray-400 first:rounded-l-xl", { "w-0": index === 0 })}
                >
                  <div className={cn("relative flex justify-end h-1 rounded-xl pt-[-5px]")}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link to={`?step=${step}`}>
                          <div
                            className={cn(
                              "absolute bg-green-700 top-[-9px] right-[-4px] w-6 h-6 shrink-0  border-2 p-1.5 rounded-full border-green-500",
                              index === current
                                ? "border-orange-500 bg-orange-700 ring-4 ring-offset-2 ring-orange-500"
                                : "",
                              index > current ? "bg-gray-700 border-gray-400" : "",
                            )}
                          >
                            <span
                              className={cn(
                                "font-mono relative text-gray-100 text-xs top-[-9px] hover:text-white hover:font-semibold",
                                { "left-[-3px]": index >= 9 },
                              )}
                            >
                              {index + 1}
                            </span>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <b>{DEFAULT_SECTION_TITLES[step]}</b>
                        <br />
                        Click to fast navigate
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
      {/* progress bar for mobiles */}
      <div className="sm:hidden my-4">
        <Progress value={progress} className="bg-white" />
      </div>
    </div>
  );
}
