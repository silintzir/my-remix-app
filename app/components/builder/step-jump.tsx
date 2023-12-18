import type { ResumeValues } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getEnabledSteps } from "@/lib/steps";
import { useNavigate } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";

type Props = {
  values: ResumeValues;
  disabled: boolean;
};
export function StepJump({ values, disabled }: Props) {
  const steps = getEnabledSteps(values.meta.steps);
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          title="Jump to any step"
          disabled={disabled}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {steps.map((step, index) => (
            <DropdownMenuItem
              onClick={() => navigate(`?step=${step}`)}
              key={step}
            >
              {index + 1}.&nbsp;{DEFAULT_SECTION_TITLES[step]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
