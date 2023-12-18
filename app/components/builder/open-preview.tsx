import { Link, useHref } from "@remix-run/react";
import { Button } from "../ui/button";

export function OpenPreview() {
  const href = useHref("?view=preview");
  return (
    <Button asChild size="sm">
      <Link to={href} className="xl:hidden fixed top-4 left-4">
        <span>View PDF</span>
      </Link>
    </Button>
  );
}
