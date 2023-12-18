import { useMe } from "@/components/hooks/useMe";
import { NavBar } from "@/components/navbar";
import { UpgradeNowButton } from "@/components/navbar/upgrade-now";
import { UserMenu } from "@/components/navbar/user-menu";
import { Logo } from "@/components/website/logo";
import type { StrapiUser } from "@/lib/types";
import { Outlet } from "@remix-run/react";

export default function Account() {
  const me = useMe();

  return (
    <main>
      <NavBar>
        <Logo />
        <div className="flex gap-2 items-center">
          <UpgradeNowButton />
          <UserMenu user={me as unknown as StrapiUser} />
        </div>
      </NavBar>
      <div className="h-[calc(100dvh-5rem)] bg-muted overflow-y-auto">
        <div className="space-y-8 p-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
