import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "@remix-run/react";

type Props = {
  resumeId: number;
};
export function ExportActionsButton({ resumeId }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-1 items-center" asChild>
            <Link to={`/app/resumes/${resumeId}/docx`} target="_blank">
              <Download />
              <span>Export to MS Word</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-1 items-center" asChild>
            <Link to={`/app/resumes/${resumeId}/json`} target="_blank">
              <Download />
              <span>Export to JSON</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
