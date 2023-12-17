import { NavBar } from "@/components/navbar";
import { UpgradeNowButton } from "@/components/navbar/upgrade-now";
import { UserMenu } from "@/components/navbar/user-menu";
import { Logo } from "@/components/website/logo";
import { fetchMe } from "@/lib/strapi.server";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    me: await fetchMe(request),
  });
}

export default function Account() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  const user = {
    firstName: "Lakis",
    lastName: "Rouvas",
    email: "lakis@hotmial.com",
    id: 123,
    jwt: "test",
  };

  return (
    <main>
      <NavBar>
        <Logo />
        <div className="flex gap-2 items-center">
          <UpgradeNowButton />
          <UserMenu user={{ ...user }} />
        </div>
      </NavBar>
      <div className="h-[calc(100vh-5rem)] bg-muted">
        <div className="space-y-8 p-8">
          <h4>
            Welcome back,{" "}
            <strong>{`${user.firstName || ""} ${user.lastName || ""}`}</strong>
          </h4>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}
