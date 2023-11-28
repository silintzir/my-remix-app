import { Link } from "@remix-run/react";
import { X } from "lucide-react";

export default function ReturnToWebsite() {
  return (
    <Link to="/" title="Back to website">
      <X className="w-6 h-6 opacity-60 hover:opacity-100" />
    </Link>
  );
}
