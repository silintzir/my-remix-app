import { usePdfStore } from "@/lib/templates/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { ClientOnly } from "remix-utils/client-only";

export function PdfPages() {
  const { numPages, nextPage, prevPage, currentPage } = usePdfStore();
  return (
    <ClientOnly fallback={<div>Page switcher</div>}>
      {() => (
        <div className="flex items-center gap-2 small font-thin">
          <Button
            variant="link"
            className="text-white"
            title="Go to previous page"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span>
            {currentPage} / {numPages}
          </span>
          <Button
            variant="link"
            className="text-white"
            title="Go to next page"
            onClick={nextPage}
            disabled={currentPage === numPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </ClientOnly>
  );
}
