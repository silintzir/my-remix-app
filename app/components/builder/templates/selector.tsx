import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

export function TemplateSelector() {
  return (
    <Button size="sm" variant="ghost">
      <LayoutTemplate className="w-4 h-4 mr-2" />
      <span>Select template</span>
    </Button>
  );
}
