import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import Website from "@/components/website";
import { getSession } from "@/sessions";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Website" },
    { name: "description", content: "Welcome to Resumerunner.ai!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isLogged: session.has("user"),
  });
}

export default function Index() {
  const { isLogged } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Website isLogged={isLogged} />
    </div>
  );
}
