import { Link, useHref } from "@remix-run/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const handle = {
  step: 1,
};

export default function Templates() {
  const href = useHref("../social-profile");
  return (
    <div className="space-y-4">
      <p>-- Template carousel should go here --</p>
      <Link to={href} className={cn(buttonVariants({ variant: "default" }))}>
        Pick this template
      </Link>
    </div>
  );
}
