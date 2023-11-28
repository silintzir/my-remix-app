import { LayoutTemplate } from "lucide-react";

export function TemplateSelector() {
  return (
    <button className="flex justify-center hover:bg-gray-700 items-center small h-[32px] px-2 rounded-full transition-all">
      <LayoutTemplate className="w-4 h-4 mr-2" />
      <span>Select template</span>
    </button>
  );
}
