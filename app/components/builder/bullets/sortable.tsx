import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle as Handle,
} from "react-sortable-hoc";

export const SortableList = SortableContainer(
  ({ children }: { children: ReactNode }) => {
    return <ul className="space-y-1 mt-2 ml-0 list-none">{children}</ul>;
  }
);
export const SortableHandle = Handle(() => (
  <GripVertical className="w-9 h-6" />
));
export const SortableItem = SortableElement(
  ({ children }: { children: ReactNode }) => {
    return <li className="flex gap-2 items-center">{children}</li>;
  }
);
