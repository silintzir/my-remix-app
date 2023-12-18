import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function UpgradeNowButton() {
  return (
    <Button variant="secondary" className="flex gap-2 items-center h-10">
      <Crown className="w-4 h-4" />
      <span>Upgrade</span>
    </Button>
  );
}
