import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "@/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return session;
}

export default function SessionView() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full px-8 py-4 bg-muted break-words whitespace-normal overflow-x-auto">
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
