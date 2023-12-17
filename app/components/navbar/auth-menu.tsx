import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";

export function AuthMenu() {
  return (
    <div className="hidden sm:flex items-center gap-4">
      <Link className="large no-underline" to="/login">
        Login
      </Link>
      <Link
        className={`large no-underline ${buttonVariants({
          variant: "default",
        })}`}
        to="/register"
      >
        Create resume
      </Link>
    </div>
  );
}
