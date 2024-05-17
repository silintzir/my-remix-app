import { Loader2 } from "lucide-react";

interface Props {
  visible: boolean;
  text?: string;
}
export function Overlay({ visible, text = 'Loading' }: Props) {
  return (
    <div className={`overlay ${visible ? "visible" : ""}`}>
      <span className="text-2xl flex gap-2 items-center bg-[rgba(100,100,100,0.5)] px-8 py-2 rounded-full shadow-xl">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>{text}...</span>
      </span>
    </div>
  );
}
