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
      <div className="text-center pt-8 h-[calc(100vh-5rem)] bg-muted">
        <Outlet />
      </div>
      <WizardFooter />
    </main>
  );
}
