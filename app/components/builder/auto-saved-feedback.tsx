import { Loader2, UploadCloud } from "lucide-react";

type Props = {
  isSaving: boolean;
};

export function AutoSavedFeedback({ isSaving }: Props) {
  return (
    <div className="small flex px-2">
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <UploadCloud className="w-4 h-4 mr-2" />
          <span>Saved</span>
        </>
      )}
    </div>
  );
}
