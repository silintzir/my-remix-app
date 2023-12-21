import { Link } from "@remix-run/react";
import { Button, type ButtonProps } from "../ui/button";
import { Download } from "lucide-react";

interface Props extends ButtonProps {
  resumeId: number;
}

export function OpenPreview({ resumeId, ...rest }: Props) {
  return (
    <Button asChild {...rest}>
      <Link to={`/resumes/${resumeId}/edit?view=preview`}>
        <Download />
        <span>Preview & Download</span>
      </Link>
    </Button>
  );
}
