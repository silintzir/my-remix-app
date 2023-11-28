import type { ErrorResult } from "domain-functions";
import { useEffect } from "react";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { get } from "lodash-es";

export function useServerErrors<T extends FieldValues>(
  actionData: ErrorResult | undefined,
  setError: UseFormSetError<T>
) {
  useEffect(() => {
    if (actionData) {
      for (const err of actionData.inputErrors) {
        const field = get(err, "path.0");
        if (field) {
          setError(field as FieldPath<T>, {
            type: "server",
            message: get(err, "message", "Unknown error"),
          });
        }
      }
      for (const err of actionData.errors) {
        setError("root", { type: "server", message: err.message });
      }
    }
  }, [actionData, setError]);
}
