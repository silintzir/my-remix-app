import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFetcher } from "@remix-run/react";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  id: number;
  title: string;
};

export function RenameResume({ id, title }: Props) {
  const fetcher = useFetcher({ key: "rename-resume" });
  const [value, setValue] = useState(title);

  const loading = fetcher.state === "submitting";

  return (
    <Popover
      onOpenChange={(state) => {
        if (!state) {
          const fd = new FormData();
          fd.append("id", id.toString());
          fd.append("title", value);

          fetcher.submit(fd, { method: "POST", action: "?intent=rename" });
        }
      }}
    >
      <PopoverTrigger asChild>
        <button disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            <Edit />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <fetcher.Form>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Rename resume</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">New name</Label>
                <Input
                  value={value}
                  onChange={(evt) => setValue(evt.currentTarget.value)}
                  className="col-span-2 h-8"
                  placeholder="Untitled resume"
                />
              </div>
            </div>
          </div>
        </fetcher.Form>
      </PopoverContent>
    </Popover>
  );
}
