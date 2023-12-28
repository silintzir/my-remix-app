import { useState } from "react";
import { Button } from "../ui/button";
import { TextInput } from "../shadcn/TextInput";
import { type Path, useFormContext } from "react-hook-form";
import type { ResumeValues } from "@/lib/types";

interface Props {
  name: Path<ResumeValues>;
  placeholder: string;
}

export function SectionRename({ name, placeholder }: Props) {
  const { control } = useFormContext<ResumeValues>();

  const [show, setShow] = useState(false);

  return (
    <div className="text-center">
      {show === false && (
        <Button variant="link" onClick={() => setShow(true)}>
          Change in-resume section title?
        </Button>
      )}
      {show && (
        <div className="mt-4">
          <TextInput
            control={control}
            name={name}
            placeholder={placeholder}
            label={
              <div className="w-full flex justify-between">
                <strong>Change section title to</strong>
                <button
                  type="button"
                  className="link text-xs"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
