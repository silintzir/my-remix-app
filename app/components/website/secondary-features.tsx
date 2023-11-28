import { Container } from "./container";
import { Tab } from "@headlessui/react";
import screenshotContacts from "@/images/screenshots/contacts.png";
import screenshotInventory from "@/images/screenshots/inventory.png";
import screenshotProfitLoss from "@/images/screenshots/profit-loss.png";

import communityImage from "@/images/solutions/community.svg";
import educationImage from "@/images/solutions/education.svg";
import governmentImage from "@/images/solutions/government.svg";
import clsx from "clsx";

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pb-12 pt-12 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Solutions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Unlock you organization&apos;s impact
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}

interface Feature {
  name: string;
  summary: string;
  description: string;
  image: string;
  icon: any;
}

const features: Feature[] = [
  {
    name: "Education",
    summary: "Unlock the potential of you student body and alumni.",
    description:
      "Empower your student body and alumni by enabling them to effortlessly create impactful resumes.  Define your desired templates, Students can easily submit their resumes for review, and they will have the option to receive valuable feedback to enhance their profiles further. With comprehensive reporting capabilities, we can track the positive effects of this partnership on our community, ensuring that we make a lasting impact on the professional growth and success of our students and alumni.",
    image: screenshotProfitLoss,
    icon: educationImage,
  },
  {
    name: "Government",
    summary: "Harness the power of professional services at a large scale.",
    description:
      "By partnering with Resume Runner, you have the freedom to define the resume workflow that best suits your organization's needs, selecting from a range of templates that align with your goals. Witness the transformation as your stakeholders excel and achieve success with their enhanced resumes, unlocking new opportunities and propelling them towards their professional aspirations.",
    image: screenshotInventory,
    icon: governmentImage,
  },
  {
    name: "Community Organizations",
    summary:
      "Integrate with Resume runner and increase your organization's impact.",
    description:
      "Integrate Resume Runner's technology to your existing client services. Whether you're starting from scratch or looking to refine an already existing resume, Resume Runner's versatile technology can adapt effortlessly to cater to the unique needs of the individuals your team serves. With Resume Runner's user-friendly interface and adaptable features, your organization can make a lasting impact on the lives and careers of those you support, reinforcing your commitment to their success and advancement.",
    image: screenshotContacts,
    icon: communityImage,
  },
];

function Feature({
  feature,
  isActive,
  className,
  ...props
}: {
  feature: Feature;
  isActive: boolean;
  className: string;
}) {
  return (
    <div className={clsx(className, !isActive && "opacity-100")} {...props}>
      {/* <svg aria-hidden="true" className="h-9 w-9" fill="none"> */}
      {/*   <feature.icon /> */}
      {/* </svg> */}
      <h3
        className={clsx(
          "mt-6 text-sm font-medium flex gap-2",
          "text-slate-600"
        )}
      >
        <img src={feature.icon} alt={feature.name} className="w-8 h-8" />
        {feature.name}
      </h3>
      <p className="mt-2 font-display text-xl text-slate-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}
function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-6 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.name}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />
          {/* <div className="relative mt-10 pb-10"> */}
          {/*   <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" /> */}
          {/*   <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"> */}
          {/*     <Image className="w-full" src={feature.image} alt="" sizes="52.75rem" /> */}
          {/*   </div> */}
          {/* </div> */}
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.name}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="[&:not(:focus-visible)]:focus:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ) as unknown as string,
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>
          {/* <Tab.Panels className="relative mt-20 overflow-hidden rounded-4xl bg-slate-200 px-14 py-16 xl:px-16"> */}
          {/*   <div className="-mx-5 flex"> */}
          {/*     {features.map((feature, featureIndex) => ( */}
          {/*       <Tab.Panel */}
          {/*         static */}
          {/*         key={feature.name} */}
          {/*         className={clsx( */}
          {/*           "px-5 transition duration-500 ease-in-out [&:not(:focus-visible)]:focus:outline-none", */}
          {/*           featureIndex !== selectedIndex && "opacity-60" */}
          {/*         )} */}
          {/*         style={{ transform: `translateX(-${selectedIndex * 100}%)` }} */}
          {/*         aria-hidden={featureIndex !== selectedIndex} */}
          {/*       > */}
          {/*         <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10"> */}
          {/*           <Image */}
          {/*             className="w-full" */}
          {/*             src={feature.image} */}
          {/*             alt="" */}
          {/*             sizes="52.75rem" */}
          {/*           /> */}
          {/*         </div> */}
          {/*       </Tab.Panel> */}
          {/*     ))} */}
          {/*   </div> */}
          {/*   <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-slate-900/10" /> */}
          {/* </Tab.Panels> */}
        </>
      )}
    </Tab.Group>
  );
}
