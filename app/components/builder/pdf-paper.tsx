import { useEffect, useRef } from "react";
import type * as PDFJS from "pdfjs-dist";
import { usePdfStore } from "@/lib/templates/store";

type Props = {
  base64: string;
  fullPage?: boolean;
};

const US_LETTER_RATIO = 1.2941;

export function PdfPaper({ base64, fullPage = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  const { setNumPages, currentPage } = usePdfStore();

  useEffect(() => {
    const updateHeight = () => {
      const maxHeight = fullPage ? window.innerHeight : window.innerHeight - 114;
      const maxWidth = fullPage ? window.innerWidth - 40 : window.innerWidth / 2 - 2 * 74;

      let width;
      let height;

      if (maxHeight / US_LETTER_RATIO > maxWidth) {
        width = maxWidth;
        height = width * US_LETTER_RATIO;
      } else {
        height = maxHeight;
        width = height / US_LETTER_RATIO;
      }

      if (ref.current) {
        ref.current.style.height = `${Math.floor(height)}px`;
        ref.current.style.width = `${Math.floor(width)}px`;
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [fullPage]);

  const pageRendering = useRef(false);
  const pageNumPending = useRef<number | null>(null);
  const pageDataPending = useRef<string | null>(null);

  useEffect(() => {
    async function run(pageNum: number, base64: string) {
      if (!ref.current || !base64.length) {
        return;
      }
      if (pageRendering.current) {
        pageNumPending.current = pageNum;
        pageDataPending.current = base64;
      } else {
        pageRendering.current = true;

        const pdfjsLib = window.pdfjsLib as typeof PDFJS;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/vendors/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: atob(base64) }).promise;
        const numPages = pdf.numPages;
        setNumPages(numPages);
        const page = await pdf.getPage(pageNum > numPages ? 1 : pageNum);

        const viewport = page.getViewport({ scale: 1 });
        ref.current.height = viewport.height;
        ref.current.width = viewport.width;
        const canvasContext = ref.current.getContext("2d");
        if (canvasContext) {
          const renderContext = { canvasContext, viewport };
          const renderTask = page.render(renderContext).promise;

          renderTask.then(() => {
            pageRendering.current = false;
            if (pageNumPending.current !== null && pageDataPending.current !== null) {
              run(pageNumPending.current, pageDataPending.current);
              pageNumPending.current = null;
            }
          });
        }
      }
    }
    console.log('rendering');

    run(currentPage, base64);
  }, [currentPage, base64, setNumPages]);

  return <canvas ref={ref} className="rounded-md shadow-xl" />;
}
