import type { ResumeValues } from "@/lib/types";

export function Chicago({ values }: { values: ResumeValues }) {
  return (
    <div>
      <dl>
        <dt>First name</dt>
        <dd style={{ color: "red" }}>{values.basics?.firstName}</dd>
      </dl>
    </div>
  );
}
