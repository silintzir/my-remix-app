import type { ResumeValues } from "@/lib/types";

export function Basic({ values }: { values: ResumeValues }) {
  return (
    <div>
      <div className="text-center">{values.basics?.firstName}</div>
    </div>
  );
}
