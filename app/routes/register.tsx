import { WizardFooter } from "@/components/footers/wizard";
import { NavBar } from "@/components/navbar";
import ReturnToWebsite from "@/components/navbar/return-website";
import { Stepper } from "@/components/stepper";
import { Logo } from "@/components/website/logo";
import { Outlet, useMatches } from "@remix-run/react";
import { last, get } from "lodash-es";

export default function CreateResume() {
  const matches = useMatches();
  const activeStep = get(last(matches), "handle.step", 1);
  return (
    <main>
      <NavBar>
        <Logo />
        <Stepper active={activeStep} />
        <ReturnToWebsite />
      </NavBar>
      <div className="absolute top-20 w-full text-center py-8 px-4 h-[calc(100dvh-5rem)] bg-muted overflow-y-auto">
        <Outlet />
      </div>
      <WizardFooter />
    </main>
  );
}
