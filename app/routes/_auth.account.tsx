import { useMe } from "@/components/hooks/useMe";
import { NavBar } from "@/components/navbar";
import { UserMenu } from "@/components/navbar/user-menu";
import { Logo } from "@/components/website/logo";
import type { StrapiUser } from "@/lib/types";
import { Outlet, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";

export default function Account() {
  const me = useMe();
  const { state } = useNavigation();

  return (
    <main>
      <NavBar>
        <Logo />
        {state === "loading" && (
          <div className="font-semibold flex items-center muted">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Loading...</span>
          </div>
        )}{" "}
        <div className="flex gap-4 items-center">
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
