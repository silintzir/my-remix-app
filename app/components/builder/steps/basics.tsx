import { TextInput } from "@/components/shadcn/TextInput";
import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import { usePlacesWidget } from "react-google-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BasicsStep() {
  const { control, setValue, getValues } = useFormContext<ResumeValues>();

  const {
    resume: {
      basics: {
        location: { address },
      },
    },
  } = getValues();

  const { ref: maps } = usePlacesWidget({
    apiKey: "AIzaSyB7-fKIMmJ7jAA_rvlz7KpR6h_4GBshRIc",
    options: {
      fields: ["ALL"],
      types: ["geocode"],
      componentRestrictions: { country: "us" },
    },
    onPlaceSelected: (place) => {
      setValue("resume.basics.location.address", place.formatted_address, {
        shouldDirty: true,
      });
    },
  });

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
          placeholder="e.x. (555) 555-5555"
          label="Phone"
          inputMask="(999) 999-9999"
        />
      </div>
      <div className="flex gap-2 sm:flex-8 flex-wrap sm:flex-nowrap">
        <div className="w-full space-y-2">
          <Label>Address</Label>
          <Input
            ref={maps as any}
            defaultValue={address}
            name="resume.basics.location.address"
            placeholder="e.x. State 100 Street, Boston 01978, MA"
            className="w-full"
          />
        </div>
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
