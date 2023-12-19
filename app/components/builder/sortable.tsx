import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle as Handle,
} from "react-sortable-hoc";

type Props = {
  children: ReactNode;
  className?: string;
};
export const SortableList = SortableContainer(
  ({ children, className }: Props) => {
    return <div className={cn("w-full", className)}>{children}</div>;
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) as any;
export const SortableHandle = Handle(() => (
  <button title="Drag to reorder">
    <GripVertical className="w-6 h-6" />
  </button>
));
export const SortableItem = SortableElement(
  ({ children, className }: Props) => {
    return (
      <div className={cn("w-full flex items-center gap-2", className)}>
        {children}
      </div>
    );
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) as any;
