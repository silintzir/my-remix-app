import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { Progress } from "@/components/ui/progress";
import type { Step } from "@/lib/types";
import { Link } from "@remix-run/react";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "../ui/tooltip";

interface Props {
  title: string;
  current: number;
  steps: Step[];
}

export function Stepper({ title, current, steps }: Props) {
  const progress = ((current + 1) / steps.length) * 100;
  return (
    <nav className="flex items-center" aria-label="Progress">
      <h3 className="text-lg font-semibold my-2 flex justify-between">
        <span>{title}</span>
        <span className="muted ml-2">
          ({current + 1} of {steps.length})
        </span>
      </h3>
      <Progress
        value={progress}
        className="flex-grow block w-auto sm:hidden bg-gray-300 ml-6"
      />
      <ol className="ml-8 items-center space-x-5 hidden sm:flex">
        {steps.map((step, index) => {
          const status =
            index === current
              ? "current"
              : index < current
              ? "complete"
              : "upcoming";
          const name = DEFAULT_SECTION_TITLES[step];

          return (
            <li key={name}>
              {status === "complete" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={`?step=${step}`}
                        className="block h-2.5 w-2.5 rounded-full bg-primary hover:bg-indigo-900"
                      >
                        <span className="sr-only">{name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : status === "current" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={`?step=${step}`}
                        className="relative flex items-center justify-center"
                        aria-current="step"
                      >
                        <span
                          className="absolute flex h-6 w-6 p-px"
                          aria-hidden="true"
                        >
                          <span className="h-full w-full rounded-full bg-indigo-200" />
                        </span>
                        <span
                          className="relative block h-2.5 w-2.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link
                        to={`?step=${step}`}
                        className="block h-2.5 w-2.5 rounded-full bg-gray-300 hover:bg-gray-500"
                      >
                        <span className="sr-only">{name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
