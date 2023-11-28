import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export function StepTooltip({ children }: Props) {
  return (
    <p className="break-words whitespace-normal w-full max-w-xs">{children}</p>
  );
}
