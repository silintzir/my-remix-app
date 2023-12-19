import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Form, useNavigation } from "@remix-run/react";
import {
  ArrowRight,
  Import,
  Loader2,
  PlusCircle,
  PlusSquare,
} from "lucide-react";
import { useState } from "react";

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
  return (
    <button
      className="outline-none text-left w-full hover:bg-gray-300 bg-gray-200 flex justify-between items-center rounded-md px-4 py-4"
      type={type}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="text-lg">Processing...</div>
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
  const [paste, setPaste] = useState(false);
  const { state } = useNavigation();

  return (
    <Dialog
      defaultOpen={startOpen}
      onOpenChange={(open) => {
        if (open === false) setPaste(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </DialogTrigger>

      {paste === false ? (
        <DialogContent className="max-w-full sm:max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle>How do you want to proceed?</DialogTitle>
            <DialogDescription>
              You have two options to create your resume:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Form method="post" action="/app/resumes/create">
              <SourceButton
                title="New resume from scratch"
                description="Choose a blank template and fill in the fields yourself"
                type="submit"
                loading={state === "submitting"}
              />
            </Form>
            <SourceButton
              title="Improve existing resume"
              description="Import your existing resume text and build on it"
              type="button"
              onClick={() => setPaste(true)}
            />
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-full sm:max-w-lg">
          <Form method="post" action={`/app/resumes/import`}>
            <div className="space-y-2">
              <DialogHeader className="text-left">
                <DialogTitle>Import your resume</DialogTitle>
                <DialogDescription>
                  Paste the text of your resume below.
                </DialogDescription>
              </DialogHeader>
              <Textarea rows={10} name="resumeText" />
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button type="submit" disabled={state === "submitting"}>
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Import className="w-4 h-4 mr-2" />
                      <span>Import</span>
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
