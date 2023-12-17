import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

export function useMyToast({
  toast,
}: {
  toast: {
    message: string;
    type: "info" | "error" | "success" | "warning";
  };
}) {
  const { toast: toastify } = useToast();

  useEffect(() => {
    if (toast && toast.type === "success") {
      toastify({
        description: (
          <span className="font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{toast.message}</span>
          </span>
        ),
      });
    }
  }, [toast, toastify]);
}
