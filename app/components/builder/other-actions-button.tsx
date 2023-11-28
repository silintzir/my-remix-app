import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function OtherActionsButton() {
  return (
    <Button size="sm" className="h-[38px] my-0 bg-blue-600 hover:bg-blue-500">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  );
}
