import type { StrapiUser } from "@/lib/types";
import { useMatches } from "@remix-run/react";
import { get } from "lodash-es";

export function useMe() {
  const matches = useMatches();
  return get(
    matches.find((m) => m.handle === "auth"),
    "data.me"
  ) as unknown as StrapiUser;
}
