import { cn } from "@/lib/utils";

type StepProps = {
  index: number;
  title: string;
  lineAfter?: boolean;
  isComplete?: boolean;
};

export function Step({
  index,
  title,
  lineAfter = false,
  isComplete = false,
}: StepProps) {
  return (
    <div className={cn("flex gap-2 items-center", { "line-after": lineAfter })}>
      <div
        className={cn(
          "rounded-full px-3 py-1 font-semibold",
          isComplete
            ? "bg-primary text-white"
            : "bg-muted text-muted-foreground"
        )}
      >
        {index}
      </div>
      <span
        className={cn(isComplete ? "text-primary" : "text-muted-foreground")}
      >
        {title}
      </span>
    </div>
  );
}

type StepperProps = {
  active: number;
};
export function Stepper({ active }: StepperProps) {
  return (
    <div className="gap-2 hidden md:flex">
      <Step
        title="Connect with us"
        index={1}
        lineAfter
        isComplete={active >= 1}
      />
      <Step
        title="Enter details"
        index={2}
        lineAfter
        isComplete={active >= 2}
      />
      <Step title="Create your resume" index={3} isComplete={active >= 3} />
    </div>
  );
}
