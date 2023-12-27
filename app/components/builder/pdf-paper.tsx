import { useEffect, useRef } from "react";
import type * as PDFJS from "pdfjs-dist";
import { useTemplateStore } from "@/lib/templates/store";
// import html2canvas from "html2canvas";
import { useFetcher } from "@remix-run/react";

type Props = {
  base64: string;
  fullPage?: boolean;
  id: number;
};

const US_LETTER_RATIO = 1.2941;

export function PdfPaper({ base64, fullPage = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  // const screenshotSaved = useRef(false);

  const { submit } = useFetcher({ key: "resume-screenshot" });

  const { setNumPages, currentPage } = useTemplateStore();

  // const { state, proceed } = useBlocker(
  //   ({ currentLocation, nextLocation }) =>
  //     !screenshotSaved.current &&
  //     currentLocation.pathname !== nextLocation.pathname
  // );

  useEffect(() => {
    const updateHeight = () => {
      const iw = window.innerWidth;
      const rightPanelWidth = fullPage ? iw : iw > 1920 ? iw - 960 : iw / 2;

      const maxHeight = fullPage
        ? window.innerHeight - 120
        : window.innerHeight - 120;
      const maxWidth = fullPage
        ? rightPanelWidth - 40
        : rightPanelWidth - 2 * 72;

      let width;
      let height;

      if (maxHeight / US_LETTER_RATIO > maxWidth) {
        width = maxWidth;
        height = width * US_LETTER_RATIO;
      } else {
        height = maxHeight;
        width = height / US_LETTER_RATIO;
      }

      const zoom = fullPage ? window.devicePixelRatio : 1;

      if (ref.current) {
        ref.current.style.height = `${Math.floor(height) * zoom}px`;
        ref.current.style.width = `${Math.floor(width) * zoom}px`;
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

        const viewport = page.getViewport({ scale: 1.5 });

        ref.current.height = viewport.height;
        ref.current.width = viewport.width;
        const canvasContext = ref.current.getContext("2d");
        if (canvasContext) {
          const renderTask = page.render({
            canvasContext,
            viewport,
            // transform: [2, 0, 0, 2, 0, 0],
          });

          renderTask.promise.then(() => {
            pageRendering.current = false;

            if (
              pageNumPending.current !== null &&
              pageDataPending.current !== null
            ) {
              run(pageNumPending.current, pageDataPending.current);
              pageNumPending.current = null;
            }
          });
        }
      }
    }

    run(currentPage, base64);
  }, [currentPage, base64, setNumPages, submit]);

  // useEffect(() => {
  //   if (state === "blocked") {
  //     html2canvas(ref.current as HTMLCanvasElement).then(async (canvas) => {
  //       const screenshot = canvas.toDataURL();
  //       const fd = new FormData();
  //       fd.append("screenshot", screenshot);
  //       // submit(fd, { method: "POST", action: `/app/resumes/${id}/screenshot` });
  //       fetch(`/resumes/${id}/screenshot`, {
  //         method: "POST",
  //         body: JSON.stringify({ screenshot }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       proceed();
  //     });
  //   }
  // }, [state, proceed, id, base64]);

  return <canvas ref={ref} className="mx-auto rounded-md shadow-xl" />;
}
