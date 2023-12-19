import { Link, useHref } from "@remix-run/react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export function OpenPreview() {
  return (
    <Button asChild variant="link" className="ml-0 pl-0">
      <Link to={useHref("?view=preview")}>
        <Download />
        <span>Preview & Download</span>
      </Link>
    </Button>
  );
}
