import { NavBar } from "@/components/navbar";
import ReturnToWebsite from "@/components/navbar/return-website";
import { Logo } from "@/components/website/logo";
import { Outlet } from "@remix-run/react";

export default function SocialConnectError() {
  return (
    <main className="bg-muted">
      <NavBar>
        <Logo />
        <ReturnToWebsite />
      </NavBar>
      <div className="text-center pt-8 h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
    </main>
  );
}
