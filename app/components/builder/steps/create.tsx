import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  ArrowRight,
  Import,
  Loader2,
  PlusCircle,
  PlusSquare,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

type ButtonProps = {
  title: string;
  description: string;
  type: "submit" | "button";
  onClick?: () => void;
  loading?: boolean;
};
function SourceButton({
  title,
  description,
  type,
  onClick,
  loading = false,
}: ButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      className="outline-none text-left w-full hover:bg-gray-300 bg-gray-200 flex justify-between items-center rounded-md px-4 py-4"
      type={type}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="text-lg">{t("base.processing")}...</div>
          <Loader2 className="animate-spin" />
        </>
      ) : (
        <>
          <div>
            <div className="flex items-center">
              <PlusSquare className="h-4 w-4 mr-2" />
              <span className="text-lg">{title}</span>
            </div>
            <span className="small muted">{description}</span>
          </div>

          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

type Props = {
  startOpen: boolean;
};
export function CreateResume({ startOpen = false }: Props) {
  const [mode, setMode] = useState<"manual" | "text" | "upload" | undefined>();

  const { state } = useNavigation();
  const { t } = useTranslation();

  const data = useActionData<{ error?: string }>();

  const error = data?.error;

  return (
    <Dialog
      defaultOpen={startOpen}
      onOpenChange={(open) => {
        if (open === false) setMode(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          {t("base.add_new")}
        </Button>
      </DialogTrigger>

      {!mode && (
        <DialogContent className="max-w-full sm:max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">
              {t("base.new_resume")}
            </DialogTitle>
            <DialogDescription>{t("base.resume_options")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Form method="post" action="?intent=manual">
              <SourceButton
                title={t("dashboard.start_empty")}
                description={t("dashboard.start_empty_subtitle")}
                type="submit"
                loading={state === "submitting" || state === "loading"}
              />
            </Form>
            <SourceButton
              title={t("dashboard.import_existing")}
              description={t("dashboard.import_existing_subtitle")}
              type="button"
              onClick={() => setMode("text")}
            />
            {/* <SourceButton */}
            {/*   title="Import existing from file" */}
            {/*   description="Upload your resume file and improve it" */}
            {/*   type="button" */}
            {/*   onClick={() => setMode("upload")} */}
            {/* /> */}
          </div>
        </DialogContent>
      )}
      {mode === "text" && (
        <DialogContent className="max-w-full sm:max-w-lg">
          <Form method="post" action="?intent=text">
            <div className="space-y-2">
              <DialogHeader className="text-left">
                <DialogTitle>{t("dashboard.import_title")}</DialogTitle>
                <DialogDescription>
                  {t("dashboard.import_title_subtitle")}
                </DialogDescription>
              </DialogHeader>
              <Textarea rows={10} name="text" />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    {t("base.cancel")}
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={state === "submitting"}>
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>{t("base.processing")}...</span>
                    </>
                  ) : (
                    <>
                      <Import className="w-4 h-4 mr-2" />
                      <span>{t("dashboard.import")}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      )}
      {mode === "upload" && (
        <DialogContent className="max-w-full sm:max-w-lg">
          <Form
            method="post"
            action="?intent=upload"
            encType="multipart/form-data"
          >
            <div className="space-y-2">
              <DialogHeader className="text-left">
                <DialogTitle>Upload your resume</DialogTitle>
                <DialogDescription>
                  Browse your computer for your resume.{" "}
                  <strong>Only PDF files can be imported.</strong>
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Resume</Label>
                <Input id="picture" name="file" type="file" />
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    {t("base.cancel")}
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={state === "submitting"}>
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>{t("base.processing")}...</span>
                    </>
                  ) : (
                    <>
                      <Import className="w-4 h-4 mr-2" />
                      <span>{t("dashboard.import")}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
