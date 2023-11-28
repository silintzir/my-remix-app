import { Hero } from "./hero";
import ContactUs from "./contact-us";
import ThankYou from "./thank-you";
import { PrimaryFeatures } from "./primary-features";
import { SecondaryFeatures } from "./secondary-features";
import { CallToAction } from "./call-to-action";
import { About } from "./about";
import { Footer } from "./footer";
import { Header } from "./header";

export default function Website() {
  return (
    <main className="bg-muted relative">
      <Header />

      <div className="text-center h-[calc(100vh-5rem)]">
        <Hero />
        <ContactUs />
        <ThankYou />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <About />
        <Footer />
      </div>
    </main>
  );
}
