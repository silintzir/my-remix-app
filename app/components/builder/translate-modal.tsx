import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import usFlag from "@/images/us-flag.svg";
import esFlag from "@/images/es-flag.svg";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

type Props = {
  resumeId: number;
};

export function TranslateModal({ resumeId }: Props) {
  const { watch } = useFormContext<ResumeValues>();

  const [open, setOpen] = useState(false);
  const lang = watch("meta.language");
  const target = lang === "en" ? "Spanish" : "English";
  const { submit, state } = useFetcher({ key: "translator" });

  useEffect(() => {
    if (state === "loading") {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open}>
      <button onClick={() => setOpen(true)}>
        <span>
          <img
            src={lang === "en" ? usFlag : esFlag}
            height="16"
            width="16"
            alt="Language"
          />
        </span>
      </button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Translate</DialogTitle>
          <DialogDescription>
            You may translate your resume to {target}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            disabled={state === "submitting"}
            onClick={() => {
              const fd = new FormData();
              fd.append("id", resumeId.toString());
              fd.append("target", target);
              submit(fd, { action: `/ai/translate`, method: "POST" });
            }}
          >
            <img
              src={lang === "en" ? esFlag : usFlag}
              height="16"
              width="16"
              alt="Language"
              className="mr-2"
            />
            {state === "submitting"
              ? "Translating..."
              : `Translate to ${target}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
