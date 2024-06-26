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
import { Link } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { useTranslation } from "react-i18next";

type Props = {
  values: ResumeValues;
};
export function StepJump({ values }: Props) {
  const steps = getEnabledSteps(values.meta.steps);
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" title="Jump to any step">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {steps.map((step, index) => (
            <DropdownMenuItem asChild key={step}>
              <Link to={step === "finish" ? `?view=preview` : `?step=${step}`}>
                {index + 1}.&nbsp;{t(DEFAULT_SECTION_TITLES[step])}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
