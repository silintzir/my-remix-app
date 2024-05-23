import { Loader2, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  isSaving: boolean;
};

export function AutoSavedFeedback({ isSaving }: Props) {
  const { t } = useTranslation();
  return (
    <div className="small flex px-2">
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>{t("builder.saving")}...</span>
        </>
      ) : (
        <>
          <UploadCloud className="w-4 h-4 mr-2" />
          <span>{t("builder.saved")}</span>
        </>
      )}
    </div>
  );
}
