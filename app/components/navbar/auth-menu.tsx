import { Link } from "@remix-run/react";
import { buttonVariants } from "../ui/button";
import { LOGIN, REGISTER } from "@/lib/routes";

export function AuthMenu() {
  return (
    <div className="hidden sm:flex items-center gap-4">
      <Link className="large no-underline" to={LOGIN}>
        Login
      </Link>
      <Link
        className={`large no-underline ${buttonVariants({
          variant: "default",
        })}`}
        to={REGISTER}
      >
        Create resume
      </Link>
    </div>
  );
}
