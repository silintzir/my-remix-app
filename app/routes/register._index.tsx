import { useNavigate } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/social/google";
import { FacebookButton } from "@/components/social/facebook";
import { REGISTER } from "@/lib/routes";
import { Mail } from "lucide-react";

export const handle = {
  step: 1,
};

export default function SocialProfile() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 max-w-xs mx-auto">
      <h1 className="font-semibold text-lg">Connect your social profile</h1>
      <p className="muted">
        Prefill your basic info with data from your social profile
      </p>

      <div className="flex gap-2 justify-center w-full flex-wrap">
        <FacebookButton />
        <GoogleButton />
        <Button
          variant="secondary"
          className="min-w-[160px] relative"
          onClick={() => navigate(`${REGISTER}/introduction`)}
        >
          <Mail className="w-5 h-5 absolute left-[18px] top-1/2 mt-[-10px]" />
          <span className="w-full">Email</span>
        </Button>
      </div>
    </div>
  );
}
