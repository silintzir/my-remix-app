import { Link, useHref } from "@remix-run/react";
import { ChevronLeft } from "lucide-react";

export function BackToEditor() {
  const href = useHref("?view=");
  return (
    <Link
      to={href}
      className="flex items-center cursor-pointer h-8 rounded pr-3.5 pl-1 -ml-2.5"
    >
      <ChevronLeft className="w-5 h-5 mr-2" />
      <span>Back</span>
    </Link>
  );
}
