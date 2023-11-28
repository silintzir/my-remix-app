import { NavBar } from "@/components/navbar";
import { UpgradeNowButton } from "@/components/navbar/upgrade-now";
import { UserMenu } from "@/components/navbar/user-menu";
import { Logo } from "@/components/website/logo";
import type { AuthUser } from "@/sessions";
import { Outlet, useOutletContext } from "@remix-run/react";

export default function Account() {
  const { user } = useOutletContext<{ user: AuthUser }>();

  return (
    <main>
      <NavBar>
        <Logo />
        <div className="flex gap-2 items-center">
          <UpgradeNowButton />
          <UserMenu user={user} />
        </div>
      </NavBar>
      <div className="h-[calc(100vh-5rem)] bg-muted">
        <div className="space-y-8 p-8">
          <h4>
            Welcome back,{" "}
            <strong>
              {`${(user.firstName || "")} ${user.lastName || ""}`}
            </strong>
          </h4>
          <div>
            <Outlet context={{ user }} />
          </div>
        </div>
      </div>
    </main>
  );
}
