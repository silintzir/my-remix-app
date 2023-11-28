import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";

export function AuthMenu() {
  return (
    <div className="hidden sm:flex items-center gap-4">
      <Link className="large no-underline" to="/app/auth/signin">
        Login
      </Link>
      <Link
        className={`large no-underline ${buttonVariants({
          variant: "default",
        })}`}
        to="/app/create-resume/templates"
      >
        Create resume
      </Link>
    </div>
  );
}
