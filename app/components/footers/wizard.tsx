import { Link } from "@remix-run/react";

export function WizardFooter() {
  return (
    <div
      className="hidden sm:block fixed bg-white bottom-0 w-full mx-auto small muted text-center py-2 px-4 shadow-xl"
      style={{ lineHeight: 1.5 }}
    >
      By signing up via your social profile or by email you agree with our{" "}
      <Link className="link" to="/tos">
        Terms of Use
      </Link>{" "}
      and{" "}
      <Link className="link" to="/privacy">
        Privacy Policy
      </Link>
      , and resumerunner.ai's{" "}
      <Link className="link" to="/tos2">
        Terms & Conditions
      </Link>{" "}
      and{" "}
      <Link className="link" to="/privacy2">
        Privacy Policy
      </Link>
      .
    </div>
  );
}
