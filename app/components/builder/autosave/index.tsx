import type { ResumeValues } from "@/lib/types";
import debounce from "debounce";
import { noop } from "lodash-es";
import { memo, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";

type Props = {
  defaultValues: ResumeValues;
  onSubmit: (data: ResumeValues) => void;
};

const AutoSave = memo(({ defaultValues, onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useFormContext();

  // eslint-disable-next-line
  const debouncedSave = useCallback(
    debounce((data) => {
      handleSubmit(onSubmit as any)();
    }, 1000),
    []
  );

  const watchedData = useWatch({
    control,
    defaultValue: defaultValues,
  });

  const myUseEffect =
    typeof window !== "undefined" ? useDeepCompareEffect : noop;

  myUseEffect(() => {
    if (isDirty) {
      debouncedSave(watchedData);
    }
  }, [watchedData]);

  // return (
  //   <div>
  //     <p>Saving: {isSubmitting ? "yes" : "no"}</p>
  //     <p>Is Dirty: {isDirty ? "yes" : "no"}</p>
  //   </div>
  // );
  //
  return null;
});

AutoSave.displayName = "AutoSave";

export { AutoSave };
