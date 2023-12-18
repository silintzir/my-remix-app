import { FontSizeAdjust, PdfPaper } from "@/components/builder";
import { TemplateSelector } from "@/components/builder/templates/selector";
import { PdfPages } from "@/components/builder/PdfPages";
import { AutoSavedFeedback } from "@/components/builder/auto-saved-feedback";
import { DownloadPdfButton } from "@/components/builder/download-pdf-button";
import { ExportActionsButton } from "@/components/builder/export-actions";
import { StartStep } from "@/components/builder/steps/start";
import { SwitchViewOverlay } from "@/components/builder/switch-view-overlay";
import { UserMenu } from "@/components/navbar/user-menu";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetch } from "@/lib/strapi.server";
import type { ResumeValues, StrapiLongResume, Step } from "@/lib/types";
import "@/styles/builder.css";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useSearchParams,
  Form,
  useLoaderData,
  useSubmit,
  useNavigation,
  useNavigate,
} from "@remix-run/react";
import { Form as SForm } from "@/components/ui/form";
import { AlertCircle, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { resumeSchema } from "@/lib/resume";
import { useEffect, useRef, useState } from "react";
import { AutoSave } from "@/components/builder/autosave";
import { BasicsStep } from "@/components/builder/steps/basics";
import { getAdjacentSteps } from "@/lib/steps";
import { parseFormData } from "parse-nested-form-data";
import { get } from "lodash-es";
import { WorkStep } from "@/components/builder/steps/work";
import { EducationStep } from "@/components/builder/steps/education";
import { SkillsStep } from "@/components/builder/steps/skills";
import { InterestsStep } from "@/components/builder/steps/interests";
import { CertificatesStep } from "@/components/builder/steps/certificates";
import { AccomplishmentsStep } from "@/components/builder/steps/accomplishments";
import { SummaryStep } from "@/components/builder/steps/summary";
import { cn } from "@/lib/utils";
import { TailorStep } from "@/components/builder/steps/tailor";
import { StepJump } from "@/components/builder/step-jump";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { sampleResume } from "@/lib/sample";
import { useBase64 } from "@/lib/templates/useBase64";
import { useMe } from "@/components/hooks/useMe";
import { Separator } from "@/components/ui/separator";
import { BackToEditor } from "@/components/builder/back-to-editor";
import { OpenPreview } from "@/components/builder/open-preview";

export async function action({ request, params }: ActionFunctionArgs) {
  const fd = await request.formData();
  const { resumeId } = params;
  const body = get(parseFormData(fd), "data", "{data:{document:{}}}") as string;
  await authenticatedFetch(request, `/api/resumes/${resumeId}`, {
    method: "PUT",
    body,
  });

  return null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { resumeId } = params;
  const response = await authenticatedFetch(
    request,
    `/api/resumes/${resumeId}`,
    { method: "GET" }
  );

  return response as { data: StrapiLongResume };
}

const sample = sampleResume();

export default function Builder() {
  const navigate = useNavigate();
  const user = useMe();
  const { state, formMethod, formData } = useNavigation();

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "";
  const step: Step = (searchParams.get("step") as Step) || "start";

  const data = useLoaderData<typeof loader>();
  const {
    data: {
      id,
      attributes: { document: defaultValues },
    },
  } = data;
  const [submittedData, setSubmittedData] =
    useState<ResumeValues>(defaultValues);

  const form = useForm<ResumeValues>({
    mode: "onBlur",
    resolver: zodResolver(resumeSchema),
    defaultValues: submittedData,
  });
  const submit = useSubmit();

  const {
    setValue,
    formState: { isSubmitSuccessful, errors },
    reset,
  } = form;

  const ref = useRef<HTMLFormElement>(null);

  function onSubmit(data: ResumeValues) {
    setSubmittedData(data);
    submit(
      {
        data: JSON.stringify({
          data: { document: data },
        }),
      },
      { method: "POST" }
    );
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...submittedData });
    }
  }, [submittedData, reset, isSubmitSuccessful]);

  useEffect(() => {
    setSubmittedData(defaultValues);
  }, [defaultValues]);

  const isSaving = state === "submitting" && formMethod === "POST";

  const isChangingStep = state === "loading" && !!formData?.get("step");

  const { previous, next } = getAdjacentSteps(step, submittedData);

  const stepHasErrors = !!get(errors, `resume.${step}`);

  const base64 = useBase64({
    values: step === "start" ? sample : defaultValues,
    isSample: step === "start",
    fontSize: submittedData.meta.fontSize,
  });

  const downloadPdf = (
    <DownloadPdfButton
      isSample={step === "start"}
      values={step === "start" ? sampleResume() : defaultValues}
      fontSize={submittedData.meta.fontSize}
    />
  );
  const fontSizeAdjust = (
    <FontSizeAdjust setValue={setValue} current={submittedData.meta.fontSize} />
  );

  const exportActions = <ExportActionsButton resumeId={id} />;

  const pdfPaper = (
    <PdfPaper base64={base64} id={id} fullPage={view === "preview"} />
  );

  return (
    <div className="flex justify-center bg-muted min-h-screen w-full xl:w-1/2 xl:max-w-[960px] mx-auto my-0 xl:mx-0">
      {/* Editor - Left Side */}
      <div className="w-full max-w-full flex-1">
        <div className="max-w-[860px] h-full m-auto">
          <div className="fixed top-4 right-4 z-50">
            <UserMenu user={user} />
          </div>

          <div className="px-4 md:px-12 py-16 sm:py-4">
            <SForm {...form}>
              <form
                method="post"
                ref={ref}
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <fieldset className="my-8">
                  {step === "start" && <StartStep />}
                  {step === "basics" && <BasicsStep />}
                  {step === "work" && <WorkStep />}
                  {step === "education" && <EducationStep />}
                  {step === "skills" && <SkillsStep />}
                  {step === "interests" && <InterestsStep />}
                  {step === "certificates" && <CertificatesStep />}
                  {step === "accomplishments" && <AccomplishmentsStep />}
                  {step === "summary" && <SummaryStep />}
                  {step === "tailor" && (
                    <TailorStep id={id} values={defaultValues} />
                  )}
                </fieldset>
                <AutoSave onSubmit={onSubmit} defaultValues={submittedData} />
              </form>
            </SForm>
            <Form>
              <div className="flex justify-end items-center gap-1">
                <div className="flex justify-center">
                  {stepHasErrors ? (
                    <span className="text-destructive flex items-center small">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Fix errors to proceed
                    </span>
                  ) : (
                    <div className={cn({ muted: !isSaving })}>
                      <AutoSavedFeedback isSaving={isSaving} />
                    </div>
                  )}
                </div>
                <Button
                  variant="secondary"
                  type={previous ? "submit" : "button"}
                  {...(previous
                    ? {}
                    : { onClick: () => navigate("/account/dashboard") })}
                  disabled={isChangingStep}
                  name="step"
                  title="Previous step"
                  value={previous || ""}
                >
                  {previous ? (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <span>Prev: {DEFAULT_SECTION_TITLES[previous]}</span>
                    </>
                  ) : (
                    <>
                      <Home className="w-4 h-4 mr-2" />
                      <span>Exit</span>
                    </>
                  )}
                </Button>
                <StepJump
                  values={submittedData}
                  disabled={isChangingStep || stepHasErrors}
                />
                <Button
                  disabled={isChangingStep || !next || stepHasErrors}
                  type="submit"
                  name="step"
                  title="Next step"
                  value={next || ""}
                >
                  <>
                    {next ? (
                      <>
                        <span>Next: {DEFAULT_SECTION_TITLES[next]}</span>
                        <ChevronRight className="h-4 w-4 mr-2" />
                      </>
                    ) : (
                      <>
                        <Home className="w-4 h-4 mr-2" />
                        <span>Exit to Dashboard</span>
                      </>
                    )}
                  </>
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Preview - Right Side */}
      {view === "" && (
        <>
          <div
            className={cn(
              "hidden xl:flex w-1/2 3xl:w-[calc(100%-960px)]",
              "fixed top-0 bottom-0 right-0",
              "items-center justify-center flex-col",
              "bg-muted-foreground text-white select-none z-0"
            )}
          >
            <div
              className={cn(
                "flex justify-center items-center",
                "absolute top-[80px] inset-x-[74px] bottom-[60px]"
              )}
            >
              <div className="inline-block relative">
                {/* focus button */}
                <SwitchViewOverlay />

                {/* top-bar */}
                <div className="absolute left-0 w-full flex items-center justify-between top-[-60px]">
                  <div className="flex items-center gap-2">
                    <TemplateSelector />
                    <Separator orientation="vertical" className="h-5 w-0.5" />
                    {fontSizeAdjust}
                  </div>
                  <div className="flex gap-1">
                    {downloadPdf}
                    {exportActions}
                  </div>
                </div>

                {/* paper  */}
                {pdfPaper}

                {/* bottom-bar  */}
                <div className="absolute left-0 right-0 flex flex-row h-16 items-center justify-center bottom-[-60px]">
                  <div className="absolute left-0">
                    <AutoSavedFeedback isSaving={isSaving} />
                  </div>
                  <div className="flex justify-center items-center">
                    <PdfPages />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OpenPreview />
        </>
      )}
      {(view === "preview" || step === "finish") && (
        <div className="fixed z-50 inset-0 bg-muted-foreground dtyMNP">
          <div className="relative flex items-center justify-between h-16 px-8 py-0 bg-[#0F141E] text-white blggRB">
            <div className="flex items-center flex-1 kcpatE">
              <BackToEditor />
            </div>

            <div className="kaOuvr relative flex items-center">
              {fontSizeAdjust}
            </div>

            <div className="flex items-center justify-end flex-1 gap-1">
              {downloadPdf}
              {exportActions}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-0 px-5">
            <div className="relative my-5 mx-auto">{pdfPaper}</div>
          </div>
        </div>
      )}
    </div>
  );
}
