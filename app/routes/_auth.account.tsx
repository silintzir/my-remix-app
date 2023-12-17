import { NavBar } from "@/components/navbar";
import { UpgradeNowButton } from "@/components/navbar/upgrade-now";
import { UserMenu } from "@/components/navbar/user-menu";
import { Logo } from "@/components/website/logo";
import { fetchMe } from "@/lib/strapi.server";
import type { StrapiUser } from "@/lib/types";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const handle = "auth";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    me: await fetchMe(request),
  });
}

export default function Account() {
  const { me } = useLoaderData<typeof loader>();

  return (
    <main>
      <NavBar>
        <Logo />
        <div className="flex gap-2 items-center">
          <UpgradeNowButton />
          <UserMenu user={me as unknown as StrapiUser} />
        </div>
      </NavBar>
      <div className="h-[calc(100vh-5rem)] bg-muted">
        <div className="space-y-8 p-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
