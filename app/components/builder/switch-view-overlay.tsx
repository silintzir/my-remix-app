import { Link, useHref } from "@remix-run/react";
import { Maximize2 } from "lucide-react";
import { useRef } from "react";

export function SwitchViewOverlay() {
  const ref = useRef<any>(null);
  const href = useHref("?view=preview");
  return (
    <div
      onMouseEnter={() => {
        if (ref.current) {
          ref.current.style.transform = "scale(1)";
        }
      }}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.transform = "scale(0)";
        }
      }}
      className="absolute inset-0 z-30 rounded flex items-center justify-center cursor-pointer hover:bg-[#DDDDDD88]"
      style={{ transition: "background 0.1s ease 0s" }}
    >
      <Link
        className="flex z-40 items-center justify-center bg-blue-600 rounded-full p-4 scale-0"
        style={{ transition: "transform 0.1s ease 0s" }}
        to={href}
        ref={ref}
      >
        <Maximize2 className="w-6 h-6" />
      </Link>
    </div>
  );
}
