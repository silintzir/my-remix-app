import { useNavigate } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackToEditor() {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" onClick={() => navigate(-1)}>
      <ChevronLeft />
      <span>Back</span>
    </Button>
  );
}
