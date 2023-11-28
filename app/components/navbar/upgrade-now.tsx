import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function UpgradeNowButton() {
  return (
    <Button variant="outline">
      <div className="flex gap-2 items-center">
        <Crown className="w-4 h-4" />
        <span>Upgrade Now</span>
      </div>
    </Button>
  );
}
