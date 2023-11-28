import { Minus, Plus } from "lucide-react";

export function FontSizeAdjust() {
  return (
    <div className="flex items-center small gap-px">
      <button
        type="button"
        title="Decrease font size"
        className="flex justify-center hover:bg-gray-700 items-center small h-[32px] px-2 rounded-full transition-all"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span>Aa</span>
      <button
        type="button"
        title="Increase font size"
        className="flex justify-center hover:bg-gray-700 items-center small h-[32px] px-2 rounded-full transition-all"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
