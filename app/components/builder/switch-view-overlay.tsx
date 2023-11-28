import { Maximize2 } from "lucide-react";
import { useRef } from "react";
import { Form } from "@remix-run/react";

export function SwitchViewOverlay() {
  const ref = useRef<HTMLButtonElement>(null);
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
      <Form>
        <button
          type="submit"
          name="view"
          value="preview"
          ref={ref}
          className="flex z-40 items-center justify-center bg-blue-600 rounded-full p-4 scale-0"
          style={{ transition: "transform 0.1s ease 0s" }}
        >
          <Maximize2 className="w-6 h-6" />
        </button>
      </Form>
    </div>
  );
}
