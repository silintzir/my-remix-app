import backgroundImage from "@/images/background-call-to-action.jpg";
import { Container } from "./container";
import { useNavigate } from "@remix-run/react";
import { Button } from "../ui/button";

export function CallToAction() {
  const navigate = useNavigate();
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-12"
    >
      <img
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Unleash Your Career Potential with Professional Resumes in Seconds
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/register")}>Get started</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
