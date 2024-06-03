import logo from "@/images/logo.png";
import { Link } from "@remix-run/react";

interface Props {
  to?: string;
}
export function Logo({ to }: Props) {
  return (
    <Link to={to ? to : "/"}>
      <img src={logo} width={120} alt="ResumeRunner" />
    </Link>
  );
}
