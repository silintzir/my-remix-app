import { getEnv } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
  const googleAuth = () => {
    window.location.assign(`${getEnv("STRAPI_HOST")}/api/connect/google`);
  };

  return (
    <Button
      className="min-w-[160px] bg-[#DB4437] border-[#DB4437] hover:bg-[#DB4437E6] relative font-bold fill-white"
      onClick={() => googleAuth()}
    >
      <span className="absolute left-4 top-1/2 mt-[-12px]">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M19 12.3058C19 11.8203 18.9606 11.3322 18.8767 10.8546L12.1404 10.8546V13.6048H15.9979C15.8379 14.4917 15.3235 15.2764 14.5704 15.775V17.5594H16.8718C18.2232 16.3155 19 14.4786 19 12.3058Z" />
            <path d="M12.1404 19.2833C14.0665 19.2833 15.6909 18.6509 16.8744 17.5592L14.573 15.7748C13.9327 16.2104 13.1061 16.4571 12.143 16.4571C10.2798 16.4571 8.70009 15.2001 8.13327 13.5101H5.75839V15.3497C6.97076 17.7613 9.44011 19.2833 12.1404 19.2833Z" />
            <path d="M8.13065 13.5102C7.83149 12.6233 7.83149 11.6628 8.13065 10.7758V8.93628H5.75839C4.74545 10.9543 4.74545 13.3318 5.75839 15.3498L8.13065 13.5102Z" />
            <path d="M12.1404 7.82623C13.1586 7.81049 14.1426 8.19362 14.88 8.8969L16.919 6.85791C15.6279 5.64554 13.9143 4.979 12.1404 4.99999C9.44011 4.99999 6.97076 6.52202 5.75839 8.93626L8.13065 10.7758C8.69485 9.08322 10.2772 7.82623 12.1404 7.82623Z" />
          </g>
        </svg>
      </span>
      Email
    </Button>
  );
}
