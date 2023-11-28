import { getEnv } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function FacebookButton() {
  const auth = () => {
    window.location.assign(`${getEnv("STRAPI_HOST")}/api/connect/facebook`);
  };

  return (
    <Button
      variant="ghost"
      className="min-w-[160px] relative bg-[#1371F0] border-[#1371F0] font-bold hover:bg-[#1371F0E6] hover:text-white text-white fill-white"
      onClick={() => auth()}
    >
      <span className="absolute left-4 top-1/2 mt-[-12px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.73 6.486v2.478H8v3.03h1.73l.013 8.506h3.552l-.014-8.505h2.384s.223-1.453.331-3.042h-2.701V6.881c0-.31.387-.726.77-.726H16V3h-2.631c-3.728 0-3.64 3.033-3.64 3.486z"></path>
        </svg>
      </span>
      Facebook
    </Button>
  );
}
