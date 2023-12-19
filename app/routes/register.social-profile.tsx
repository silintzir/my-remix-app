import { Link } from "@remix-run/react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/social/google";
import { FacebookButton } from "@/components/social/facebook";
import { REGISTER } from "@/lib/routes";

export const handle = {
  step: 2,
};

export default function SocialProfile() {
  return (
    <div className="space-y-4 max-w-xs mx-auto">
      <h1 className="font-semibold text-lg">Connect your social profile</h1>
      <p className="muted">
        Prefill your basic info with data from your social profile
      </p>

      <div className="flex gap-2 justify-center w-full flex-wrap">
        <FacebookButton />
        <GoogleButton />
      </div>

      <Separator className="my-4" />
      <div className="flex justify-between items-center">
        <Link
          to={REGISTER}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back
        </Link>
        <Link
          to={`${REGISTER}/introduction`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Skip
        </Link>
      </div>
    </div>
  );
}
