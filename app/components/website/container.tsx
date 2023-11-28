import React from "react";
import clsx from "clsx";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: Props) {
  return (
    <div
      className={clsx("mx-auto max-w-6xl px-2 sm:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
