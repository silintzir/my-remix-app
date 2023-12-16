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
        <Button
          size="sm"
          className="h-[38px] my-0 bg-blue-600 hover:bg-blue-500"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex gap-1 items-center" asChild>
            <Link to={`/app/resumes/${resumeId}/docx`} target="_blank">
              <Download className="w-4 h-4 mr-2" />
              <span>Export to MS Word</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-1 items-center" asChild>
            <Link to={`/app/resumes/${resumeId}/json`} target="_blank">
              <Download className="w-4 h-4 mr-2" />
              <span>Export to JSON</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
