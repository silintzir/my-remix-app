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
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { useFormContext } from "react-hook-form";
import usFlag from "@/images/us-flag.svg";
import esFlag from "@/images/es-flag.svg";
import { useFetcher } from "@remix-run/react";

type Props = {
  resumeId: number;
};

export function TranslateModal({ resumeId }: Props) {
  const { watch } = useFormContext<ResumeValues>();

  const lang = watch("meta.language");

  const target = lang === "en" ? "Spanish" : "English";

  const fetcher = useFetcher({ key: "translator" });

  return (
    <Dialog>
      <DialogTrigger>
        <span>
          <img
            src={lang === "en" ? usFlag : esFlag}
            height="16"
            width="16"
            alt="Language"
          />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Translate</DialogTitle>
          <DialogDescription>
            You may translate your resume to {target}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                const fd = new FormData();
                fd.append("id", resumeId.toString());
                fd.append("target", target);
                fetcher.submit({}, { action: `/ai/translate`, method: "POST" });
              }}
            >
              <img
                src={lang === "en" ? esFlag : usFlag}
                height="16"
                width="16"
                alt="Language"
                className="mr-2"
              />
              <span>Translate to {target}</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
