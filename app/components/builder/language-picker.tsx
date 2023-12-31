import usFlag from "@/images/us-flag.svg";
import esFlag from "@/images/es-flag.svg";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { ResumeValues, Step } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_SECTIONT_TITLES_ES,
  DEFAULT_SECTION_TITLES,
} from "@/lib/defaults";
// import { useTranslation } from "react-i18next";

export function LanguagePicker() {
  // const { i18n } = useTranslation();
  const { control, setValue } = useFormContext<ResumeValues>();

  return (
    <div className="small flex gap-1 items-center">
      <FormField
        control={control}
        name="meta.language"
        render={({ field }) => (
          <FormItem className="w-[140px]">
            <FormLabel>Select language</FormLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                const source =
                  val === "en"
                    ? DEFAULT_SECTION_TITLES
                    : DEFAULT_SECTIONT_TITLES_ES;
                (
                  [
                    "basics",
                    "work",
                    "education",
                    "skills",
                    "interests",
                    "accomplishments",
                    "certificates",
                    "summary",
                  ] as Step[]
                ).forEach((step) => {
                  setValue(`meta.steps.${step}.title`, source[step], {
                    shouldDirty: true,
                  });
                });
                // i18n.changeLanguage(val);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <img src={usFlag} height="16" width="16" alt="English" />
                    <span>English</span>
                  </div>
                </SelectItem>
                <SelectItem value="es">
                  <div className="flex items-center gap-2">
                    <img src={esFlag} height="16" width="16" alt="English" />
                    <span>Spanish</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}
