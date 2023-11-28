import type { SessionData } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";

export default function App() {
  const sess = useOutletContext<SessionData>();
  return <div>User ID: {sess.user.id}</div>;
}
