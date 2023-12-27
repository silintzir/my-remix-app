import * as React from "react";
import ReactInputMask from "react-input-mask";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
};

const InputMask = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, mask, type, ...props }, ref) => {
    return (
      <ReactInputMask
        type={type}
        mask={mask}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref as any}
        {...props}
      />
    );
  }
);
InputMask.displayName = "InputMask";

export { InputMask };
