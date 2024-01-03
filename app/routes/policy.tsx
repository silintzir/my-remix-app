import { Header } from "@/components/website/header";
import { getSession } from "@/sessions";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import backgroundImage from "@/images/background-company.jpg";
import { Container } from "@/components/website/container";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isLogged: session.has("user"),
  });
}

export default function Index() {
  const { isLogged } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <main className="bg-muted relative">
        <Header isLogged={isLogged} />
        <div className="h-[calc(100vh-5rem)] mt-8">
          <section
            id="policy"
            aria-labelledby="policy-title"
            className="relative overflow-hidden bg-slate-50 py-10 sm:py-16"
          >
            <Container className="relative">
              <div className="mx-auto w-full lg:mx-0">
                <h2
                  id="faq-title"
                  className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl mb-4"
                >
                  Privacy policy
                </h2>
                <p>
                  Our Privacy Policy is designed to assist you in understanding
                  how we collect and use the personal information you provide to
                  us on www.resumerunner.ai and to assist you in making informed
                  decisions when using our website, services, and products.
                </p>
                <h3 className="mt-4 mb-1 font-semibold">
                  Information We Collect
                </h3>
                <p>
                  Resume Runner collects information that identifies, relates
                  to, describes, references, is reasonably capable of being
                  associated with, or could reasonably be linked, directly or
                  indirectly, with a particular consumer, household, or device
                  (“Personal Information“). We have collected the following
                  categories of personal information from individuals within the
                  last twelve (12) months:
                </p>
                <ul>
                  <li>
                    Identifiers, including individual’s name, home address,
                    telephone number, or email address
                  </li>
                  <li>
                    Personal information categories, including individual’s
                    signature, education, employment history, bank account or
                    any other financial information, medical information, or
                    health insurance information
                  </li>
                  <li>
                    Characteristics of protected classifications, such as race,
                    national origin, gender, age, medical conditions,
                    citizenship, disability, military or veteran status, request
                    for family and medical care leave, and request for pregnancy
                    disability leave
                  </li>
                  <li>
                    Internet or other similar network activity, including
                    browsing or search history
                  </li>
                  <li>
                    Geolocation data, such as the location of company-issued
                    laptops, mobile phones, device location
                  </li>
                  <li>
                    Professional or employment-related information, such as work
                    history, prior employer, human resources data, and data
                    necessary for administering benefits and related
                    administrative services
                  </li>
                  <li>
                    Non-publicly available educational information as defined
                    under the Family Educational Rights and Privacy Act (FERPA)
                    and related regulations, such as a grade point average and
                    school transcript
                  </li>
                  <li>
                    Inferences drawn from other personal information to create
                    profiles reflecting preferences, characteristics,
                    psychological trends, predispositions, behavior, attitudes,
                    intelligence, abilities, or aptitudes.
                  </li>
                  <li>
                    Social Media Login Data. We provide you with the option to
                    register using social media account details, like your
                    Facebook or Google. If you choose to register in this way,
                    we will collect the Information described in the section
                    “How do we handle your social logins”
                  </li>
                </ul>
                <h3 className="mt-4 mb-1 font-semibold">
                  Sources of Information We Collect
                </h3>
                <p>
                  We have collected the categories of Personal Information
                  listed above from the following categories of sources:
                </p>
                <ul>
                  <li>
                    Directly from you.For example, from applications, forms, or
                    communications you complete when applying for employment or
                    utilizing Resume Runner’s services.
                  </li>{" "}
                  <li>
                    Indirectly from you. For example, from observing your
                    actions on our website, application, and other technologies.
                    Additionally, we may receive personal information about you
                    from third parties. For example, we may receive information
                    from publicly available career sites. Additionally, you may
                    choose to provide us with information processed by a
                    third-party website, such as a job search or social media
                    website. We may receive information from parties providing
                    background and drug screening, identity verification, and
                    work authorization information. We use this information to
                    determine which employment opportunities may be a good match
                    for you based on your skills, experience, and/or feedback
                    from our clients or other third parties.
                  </li>
                </ul>
                Use of Personal Information We may use or disclose the personal
                information we collect for one or more of the following
                purposes: To facilitate account creation and logon process. We
                use information you provide to create an account with us. If you
                choose to link your account with us to a third party account
                (such as your Google or Facebook account), we use the
                information you allowed us to collect from those third parties
                to facilitate account creation and logon process. See the
                section below “How do we handle your social logins ” for further
                information. Provide Resume Runner services to our workforce and
                our clients Process employment applications for positions you
                may apply for with Resume Runner or Resume Runner clients Match
                candidates and Resume Runner clients with job opportunities,
                including using geographic or location data to determine an
                individual’s proximity to a worksite or job location/opportunity
                Meet our obligations as an employer under your employment
                contract or other applicable employment laws Manage employment
                relationships with individuals including human resource related
                matters Educate, train, and develop our employees and workforce
                Administer our account with individuals Administer and manage
                Resume Runner internal business operations, including conducting
                audits, fraud monitoring and prevention, troubleshooting, data
                analytics, testing, research, statistics and surveys, including
                analyzing our job candidate and associate bases, surveying
                individuals’ work- related skills, analyzing hiring practices,
                and identifying skills and qualification data Provide
                information on Resume Runner services individuals may request
                from Resume Runner Communicate or market Resume Runner services
                or other products or services Resume Runner offers or believes
                that individuals might be interested, including relevant job and
                employment opportunities, including sending e-mails and other
                promotional communication about Resume Runner and Resume Runner
                services, including marketing, advertising, surveys,
                promotional, and thought leadership material Comply with all
                applicable laws, rules and regulations, including health and
                safety obligations Respond to requests from individuals,
                including the exercise of any access rights Optimize
                individual’s experience in receiving Resume Runner services
                Manage, administer, and monitor our technology, application, and
                website usage, including monitoring our network and information
                security Ensure that the content on our website is presented in
                the most efficient manner Use for other permissible business
                purposes, such as data analysis and developing new products,
                services, and offerings Disclosure of Personal Information
                Resume Runner may disclose Personal Information as necessary to
                complete legitimate business, commercial, and/or legal purposes.
                We may disclose Personal information to: Any member of our
                group, which means our subsidiaries, our ultimate holding
                company, and its subsidiaries, who may support us in our data
                processing and provision of Resume Runner services Service
                providers assisting in providing the Resume Runner services and
                managing our internal business operations, including but not
                limited to support for recruitment, interviewing, applicant
                tracking, resume/CV management, infrastructure management,
                platform management, application services, marketing, data
                analytics, skill assessments, and drug and background screening
                to manage requests and questions from you, personalize or
                enhance transactions, verify, process, store, enforce,
                investigate and/or collect actual or potential transactions, or
                assist or respond to our consultants including, but not limited
                to, auditors and lenders Resume Runner customers and clients so
                that you may perform work for them and/or be considered by them
                for employment opportunities Government regulators, law
                enforcement authorities or alleged victims of identity theft (i)
                if we are required to do so by law or legal purpose, (ii) if we
                believe appropriate in response to a lawful disclosure request,
                and (iii) when we believe disclosure is necessary or appropriate
                to prevent physical harm or financial loss, or in connection
                with an investigation of suspected or actual fraudulent or
                illegal activity To third parties in the event of a merger,
                acquisition, reorganization, restructuring, assignment, sale of
                assets, or bankruptcy or insolvency To third parties as
                necessary to exercise our rights or to assist third parties in
                defending their rights under applicable laws, including, without
                limitation, to assert, defend, and enforce our property rights
                and to respond to legal process Analytics and search engine
                providers that assist us in the improvement and optimization of
                our website To any third parties in which you explicitly direct
                or consent for us to provide information No Sale of Personal
                Information In the last 12 months, Resume Runner has NOT sold
                Personal Information to third parties. Retention of Personal
                Information Resume Runner may retain Personal Information as
                necessary to achieve the collection and use purposes. This may
                include retaining Personal Information: (a) for as long as we
                have an ongoing legitimate business purpose for retaining such
                information; (b) for as long as we provide Resume Runner
                services to you; (c) to comply with our legal obligations (e.g.,
                if you are an employee of Resume Runner we have certain legal
                obligations to maintain information past the end of your
                employment); and (d) to resolve disputes and enforce our
                agreements. Individual’s Rights and Choices Individuals have
                specific rights regarding their Personal Information.
                Individuals’ rights include the following: – Right to be
                Informed: Individuals have the right to be informed of: (a) the
                categories of personal information collected about them; (b) the
                categories of collection sources; (c) the business or commercial
                purposes for processing such personal information; and (d) the
                categories of third parties with whom we share such personal
                information. – Right to Access: Individuals have the right to
                request access to a copy of the personal information collected
                about them over the past 12 months. – Right to Delete: In
                certain circumstances and subject to certain exceptions,
                individuals may have the right to request that their personal
                information be deleted. – Right to Opt-Out of Sales of Personal
                Data: Individuals the right to opt out of the sale of their
                personal information. Your Personal Information is never sold,
                rented, or leased to any external company, unless you have
                granted us permission to do so. – Right to Limit Use of
                Sensitive Personal Information: Individuals have the right to
                limit usage of Sensitive Personal Information to the extent
                necessary to perform the services reasonably expected by the
                consumer. – Right to Non-Discrimination: Resume Runner will not
                discriminate against individuals when they exercise their
                privacy rights under the CCPA and will not: (a) deny
                individual’s goods or services; (b) charge you different prices
                or rates for goods or services; or (c) provide individuals with
                a different level of quality of good or services. However, due
                to the nature of the Resume Runner Services, failure to provide
                certain personal information may result in Resume Runner being
                unable to provide such Resume Runner Services without certain
                requisite personal information. How do we handle your social
                logins? Resume Runner may offer you the ability to register and
                login using your third party social media account details (like
                your Facebook or Google logins). If you choose to do this, we
                will receive certain profile information about you from the
                social media company. The profile information we receive may
                vary depending on the social media provider, but will often
                include your name, email address, profile picture as well as
                other information you choose to make public. We will use the
                information we receive for the purposes that are described in
                this Policy. Please note that we do not control, and are not
                responsible for, other uses of your personal data by the social
                media company. We recommend that you review their privacy policy
                to understand how they collect, use and share your personal
                data, and how you can set your privacy preferences on their
                sites and applications. How to Exercise Your Rights If you wish
                to exercise your rights regarding your Personal Information, you
                may submit a request as follows: – Online: At any point in time,
                you can delete you account and all information by logging into
                Resume Runner, clicking your profile, and selecting delete your
                account. To revoke social login access, please refer to the
                social platform used for instructions. Each social login
                platform will have different means of revoking access. – Email:
                compliance@resumeruner.ai include the following information
                First Name Last Name Current Address Phone Nature of Request
                Resume Runner may take steps in compliance with applicable law
                to verify a requestor’s identity. Subject to applicable law,
                Resume Runner may limit or deny requests. Resume Runner is only
                required to respond to verifiable consumer requests in which
                Resume Runner can reasonably verify the request is made by the
                consumer about whom Resume Runner has collected Personal
                Information. Changes to this Notice Resume Runner may modify
                this Notice at any time, and any modified version is effective
                immediately upon posting. Resume Runner encourages you to review
                the Notice each time you visit our websites. Contact Us If you
                have any questions or comments about this notice, the ways in
                which Resume Runner collects and uses your information described
                here and in the Privacy Notice, your choices, and rights
                regarding such use, or wish to exercise your rights, please do
                not hesitate to contact us at: Email: compliance@resumerunner.ai
                Mail: Resume Runner 164 Westford Rd Unit 26 Tyngsboro, MA 01879
                Attn: Compliance
              </div>
            </Container>
          </section>
        </div>
      </main>
    </div>
  );
}
