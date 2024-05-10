import { Download, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useFetcher } from "@remix-run/react";
import { Button, type ButtonProps } from "../ui/button";

interface Props extends ButtonProps {
  resumeId: number;
}
export function SecondaryActions({ resumeId, ...rest }: Props) {
  const fetcher = useFetcher({ key: "resume-delete" });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...rest}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={`/resumes/${resumeId}/docx`} target="_blank">
              <Download />
              <span>Export to MS Word</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/resumes/${resumeId}/json`} target="_blank">
              <Download />
              <span>Export to JSON</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              if (
                confirm(
                  "Deleting a resume is an action that cannot be undone. Proceed anyway?"
                )
              ) {
                fetcher.submit(
                  {},
                  { method: "DELETE", action: `/resumes/${resumeId}/delete` }
                );
              }
              return false;
            }}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2">Delete resume</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
