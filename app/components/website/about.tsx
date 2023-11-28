import { Container } from "./container";
import backgroundImage from "@/images/background-company.jpg";

export function About() {
  return (
    <section
      id="aboutus"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-10 sm:py-16"
    >
      <img
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
      />
      <Container className="relative">
        <div className="mx-auto w-full lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            About us
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Driven by a team boasting over two decades of expertise in staffing
            and HR, Resume Runner was established with the purpose of bridging
            the divide between talented individuals we encounter daily and the
            resumes that flood our inboxes. Our fundamental mission at Resume
            Runner is to grant access to exceptional resumes for individuals at
            every stage of their careers. We aim to eliminate the resume&apos;s
            role as a hindrance and transform it into a catalyst for
            professional growth. By doing so, we empower individuals,
            transforming their resumes from mere barriers to potent career
            enablers.
          </p>
        </div>
      </Container>
    </section>
  );
}
