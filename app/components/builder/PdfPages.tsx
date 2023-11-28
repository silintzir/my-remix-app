import { ChevronLeft, ChevronRight } from "lucide-react";

export function PdfPages() {
  return (
    <div className="flex items-center gap-2 small font-thin">
      <ChevronLeft className="w-5 h-5 opacity-40" />
      <span>1 / 1</span>
      <ChevronRight className="w-5 h-5 opacity-40" />
    </div>
  );
}
