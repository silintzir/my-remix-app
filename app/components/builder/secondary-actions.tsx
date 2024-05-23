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
import { useTranslation } from "react-i18next";

interface Props extends ButtonProps {
  resumeId: number;
}
export function SecondaryActions({ resumeId, ...rest }: Props) {
  const fetcher = useFetcher({ key: "resume-delete" });
  const { t } = useTranslation();
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
              <span>{t("dashboard.export_ms")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/resumes/${resumeId}/json`} target="_blank">
              <Download />
              <span>{t("dashboard.export_json")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              if (confirm(t("dashboard.delete_warning"))) {
                fetcher.submit(
                  {},
                  { method: "DELETE", action: `/resumes/${resumeId}/delete` }
                );
              }
              return false;
            }}
          >
            <Trash className="h-4 w-4" />
            <span className="ml-2">{t("dashboard.delete_resume")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
