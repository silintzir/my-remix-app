import logo from "@/images/logo.png";
import { Link } from "@remix-run/react";

export function Logo() {
  return (
    <Link to="/">
      <img src={logo} width={120} alt="ResumeRunner" />
    </Link>
  );
}
