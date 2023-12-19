import { Link, useHref } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackToEditor() {
  const href = useHref("?view=");
  return (
    <Button asChild variant="ghost">
      <Link to={href}>
        <ChevronLeft />
        <span>Back</span>
      </Link>
    </Button>
  );
}
