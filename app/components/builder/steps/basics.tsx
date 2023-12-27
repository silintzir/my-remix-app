import { TextInput } from "@/components/shadcn/TextInput";
import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";

export function BasicsStep() {
  const { control } = useFormContext<ResumeValues>();

  return (
    <div className="space-y-2">
      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
        <TextInput
          control={control}
          name="resume.basics.firstName"
          placeholder="e.x. John"
          label="First name"
        />
        <TextInput
          control={control}
          name="resume.basics.lastName"
          placeholder="e.x. Doe"
          label="Last name"
        />
      </div>
      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
        <TextInput
          control={control}
          name="resume.basics.email"
          placeholder="e.x. jdoe@example.com"
          label="Email"
          type="email"
        />
        <TextInput
          control={control}
          name="resume.basics.phone"
          placeholder="e.x. +1 978 555 5555"
          label="Phone"
          inputMask="+1 (999) 999-9999"
        />
      </div>
      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
        <TextInput
          control={control}
          name="resume.basics.location.address"
          placeholder="e.x. State 100 Street, Boston 01978, MA"
          label="Address"
        />
        <TextInput
          control={control}
          name="resume.basics.url"
          placeholder="e.x. https://linkedin.com/jdoe"
          label="Website / Social profile URL"
        />
      </div>
    </div>
  );
}
