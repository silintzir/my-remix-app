import { useFormContext } from "react-hook-form";
import type { ResumeValues } from "@/lib/types";
import { SelectInput } from "../shadcn/SelectInput";
import { useFetcher } from "@remix-run/react";

interface Props {
  id: number;
}
export function OutputSettings({ id }: Props) {
  const { control, setValue, getValues } = useFormContext<ResumeValues>();

  const translator = useFetcher({ key: "translate" });

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        <label className="hidden 2xl:block">Template: </label>
        <SelectInput
          className="w-full text-black"
          control={control}
          options={[
            { label: "Chicago", value: "chicago" },
            { label: "Admin executive", value: "executive" },
            { label: "Accountant", value: "accountant" },
          ]}
          name="meta.template"
        />
      </div>
      <div className="flex gap-2 items-center">
        <SelectInput
          className="w-full text-black"
          control={control}
          options={[
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" },
          ]}
          onChange={(value) => {
            setValue('meta.language', value as "en" | "es");
            const fd = new FormData();
            fd.append("values", JSON.stringify(getValues()));
            fd.append("id", id.toString());
            fd.append("target", value);

            translator.submit(fd, {
              method: "POST",
              action: `/ai/translate`,
            });
          }}
          name="meta.language"
        />
      </div>
    </div>
  );

  // return (
  //   <Popover>
  //     <PopoverTrigger asChild>
  //       <Button variant="ghost">
  //         <SlidersHorizontal />
  //         <span>Settings</span>
  //       </Button>
  //     </PopoverTrigger>
  //     <PopoverContent className="w-80 space-y-4">
  //       <div className="flex items-center gap-4">
  //         <Label htmlFor="maxWidth">Language</Label>
  //         <SelectInput
  //           className="w-full"
  //           control={control}
  //           options={[
  //             { label: "English", value: "en" },
  //             { label: "Spanish", value: "es" },
  //           ]}
  //           onChange={(value) => {
  //             setTimeout(() => {
  //               setOpen(value);
  //             }, 1000);
  //           }}
  //           name="meta.language"
  //         />
  //       </div>
  //       <div className="grid grid-cols-3 items-center gap-4">
  //         <Label htmlFor="width">Font size</Label>
  //         <FontSizeAdjust />
  //         <strong>{values.meta.fontSize}pt</strong>
  //       </div>
  //       <div className="grid grid-cols-3 items-center gap-4">
  //         <Label htmlFor="width">Template</Label>
  //         <strong>{values.meta.fontSize}pt</strong>
  //       </div>
  //     </PopoverContent>
  // //   </Popover>
  // );
}
