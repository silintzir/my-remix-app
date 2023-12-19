import { useTemplateStore } from "@/lib/templates/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { ClientOnly } from "remix-utils/client-only";

export function PdfPages() {
  const { numPages, nextPage, prevPage, currentPage } = useTemplateStore();
  return (
    <ClientOnly fallback={<div>Page switcher</div>}>
      {() => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            title="Go to previous page"
            onClick={prevPage}
            size="sm"
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <span className="small">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="ghost"
            title="Go to next page"
            onClick={nextPage}
            size="sm"
            disabled={currentPage === numPages}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </ClientOnly>
  );
}
