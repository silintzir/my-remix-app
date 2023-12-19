import { Link, useHref } from "@remix-run/react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export function OpenPreview() {
  return (
    <Button asChild>
      <Link to={useHref("?view=preview")}>
        <Download />
        <span>Preview & Download</span>
      </Link>
    </Button>
  );
}
