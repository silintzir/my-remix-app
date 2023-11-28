import { Link, useHref } from "@remix-run/react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/social/google";
import { FacebookButton } from "@/components/social/facebook";

export const handle = {
  step: 2,
};

export default function SocialProfile() {
  const hrefNext = useHref("../introduction");
  const hrefPrev = useHref("../templates");
  return (
    <div className="space-y-4 max-w-xs mx-auto px-4">
      <h1 className="font-semibold text-lg">Connect your social profile</h1>
      <p className="muted">
        Prefill your resume with data from your social profile
      </p>

      <div className="flex gap-2 justify-center w-full flex-wrap">
        <FacebookButton />
        <GoogleButton />
      </div>

      <Separator className="my-4" />
      <div className="flex justify-between items-center">
        <Link
          to={hrefPrev}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back
        </Link>

        <Link
          to={hrefNext}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Skip
        </Link>
      </div>
    </div>
  );
}
