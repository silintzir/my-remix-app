import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ResumeValues } from "@/lib/types";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
export function TranslateModal() {
  const { watch } = useFormContext<ResumeValues>();
  const [open, setOpen] = useState(false);

  const lang = watch("meta.language");

  useEffect(() => {
    console.log(lang);
  }, [lang]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Translate</DialogTitle>
          <DialogDescription>
            You may select to translate any existing text to the target language
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
