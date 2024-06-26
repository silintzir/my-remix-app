import { type MetaFunction, useNavigate } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/social/google";
// import { FacebookButton } from "@/components/social/facebook";
import { REGISTER } from "@/lib/routes";
import { Mail } from "lucide-react";

export const handle = {
  step: 1,
};

export const meta: MetaFunction = () => {
  return [{ title: "Register" }];
};

export default function SocialProfile() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4 max-w-xs mx-auto">
      <h1 className="font-semibold text-lg">Welcome</h1>
      <p className="muted">
        Register with your gmail account or connect using your email.
      </p>

      <div className="flex gap-2 justify-center w-full flex-wrap">
        {/* <FacebookButton /> */}
        <GoogleButton />
        <Button
          className="min-w-[160px] relative flex items-center"
          onClick={() => navigate(`${REGISTER}/introduction`)}
        >
          <Mail className="w-5 h-5 ml-1" />
          <span className="w-full" style={{ marginLeft: "-18px!important" }}>
            Email
          </span>
        </Button>
      </div>
    </div>
  );
}
