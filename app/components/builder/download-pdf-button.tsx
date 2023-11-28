import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback } from "react";

export function DownloadPdfButton() {
  const create = useCallback(() => {
    const doc = document.getElementById("preview-body") as HTMLDivElement;

    const cloned = doc.cloneNode(true) as HTMLDivElement;
    cloned.style.width = "8.5in";
    cloned.style.height = "11in";
    document.body.appendChild(cloned);
    cloned.style.fontSize = `${cloned.offsetWidth / 30}px`;
    window
      .html2pdf()
      .set({
        filename: "resume.pdf",
        image: { type: "png" },
        jsPDF: {
          format: "letter",
          unit: "px",
          orientation: "portrait",
          hotfixes: ["px_scaling"],
        },
        html2canvas: {
          width: cloned.offsetWidth,
          height: cloned.offsetHeight,
        },
      })
      .from(cloned)
      .save();
    document.body.removeChild(cloned);
  }, []);

  return (
    <Button
      size="sm"
      className="h-[38px] my-0 bg-blue-600 hover:bg-blue-500"
      onClick={create}
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
