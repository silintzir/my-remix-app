import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle as Handle,
} from "react-sortable-hoc";

type SProps = {
  children: ReactNode;
  value: string;
};
export const SortableAccordionList = SortableContainer(
  ({ children, value }: SProps) => {
    return (
      <Accordion
        type="single"
        value={value}
        collapsible
        className="w-full space-y-2"
      >
        {children}
      </Accordion>
    );
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) as any;
export const SortableAccordionHandle = Handle(() => (
  <GripVertical className="w-6 h-6" />
));
export const SortableAccordionItem = SortableElement(
  ({ children, value }: SProps) => {
    return (
      <AccordionItem
        value={value}
        className="border-2 border-bg-gray-500 bg-white px-4 rounded-md data-[state=open]:border-gray-600 data-[state=open]:bg-muted"
      >
        {children}
      </AccordionItem>
    );
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) as any;
