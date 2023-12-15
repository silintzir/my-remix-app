import { defaultResumeValues } from "./defaults";
import type { ResumeValues } from "./types";
import { mapValues } from "lodash-es";

export const sampleResume = (): ResumeValues => {
  const defaults = defaultResumeValues({ firstName: "", lastName: "", email: "" });
  return {
    meta: {
      ...defaults.meta,
      order: [
        "basics",
        "summary",
        "work",
        "education",
        "skills",
        "certificates",
        "accomplishments",
        "interests",
      ],
      title: "Sample resume",
      mode: "custom",
      steps: mapValues(defaults.meta.steps, (v) => ({ ...v, enabled: true })),
    },
    resume: {
      basics: {
        firstName: "John Doe",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "(555) 555-5555",
        url: "http://johndoe.com",
        location: {
          address: "2712 Broadway St",
        },
      },
      work: [
        {
          uuid: "",
          name: "Company One",
          position: "Senior Developer",
          startDate: "04/2019",
          endDate: "Present",
          city: "Boston",
          state: "MA",
          bullets: [
            { uuid: "", content: "Lead the development of a new product line" },
            { uuid: "", content: "Managed a team of developers" },
          ],
        },
        {
          uuid: "",
          name: "Company Two",
          position: "Software Engineer",
          startDate: "06/2016",
          endDate: "03/2019",
          city: "Los Angeles",
          state: "CA",
          bullets: [
            { uuid: "", content: "Developed a successful internal tool" },
            { uuid: "", content: "Contributed to open source projects" },
          ],
        },
        {
          uuid: "",
          name: "Company Three",
          position: "Junior Developer",
          startDate: "09/2014",
          endDate: "05/2016",
          city: "Chicago",
          state: "IL",
          bullets: [
            { uuid: "", content: "Worked on front-end development" },
            { uuid: "", content: "Participated in product design brainstorming sessions" },
          ],
        },
        {
          uuid: "",
          name: "Company Three",
          position: "Intern Developer",
          startDate: "07/2012",
          endDate: "01/2013",
          city: "Chicago",
          state: "IL",
          bullets: [
            { uuid: "", content: "Trained to proprietary web dev frameworks" },
            { uuid: "", content: "Participated in the summer hackathlon" },
          ],
        },
      ],
      education: [
        {
          uuid: "",
          institution: "University A",
          area: "Computer Science",
          studyType: "Bachelor",
          startDate: "08/2010",
          endDate: "05/2014",
          city: "Denver",
          state: "TX",
          status: "graduated",
          bullets: [
            { uuid: "", content: "CS101 - Intro to Computer Science" },
            { uuid: "", content: "CS102 - Advanced Algorithms" },
            { uuid: "", content: "CS103 - Linear Algebra" },
          ],
        },
        {
          uuid: "",
          institution: "University B",
          area: "Software Engineering",
          studyType: "Masters",
          startDate: "09/2014",
          endDate: "05/2016",
          city: "Miami",
          state: "FL",
          status: "graduated",
          bullets: [
            { uuid: "", content: "SE201 - Software Engineering Principles" },
            { uuid: "", content: "SE202 - Software Architecture" },
          ],
        },
      ],
      skills: [
        { uuid: "", name: "Java", level: "advanced" },
        { uuid: "", name: "Relational Databases", level: "advanced" },
        { uuid: "", name: "Unix/Linux OS", level: "expert" },
      ],
      certificates: [
        {
          uuid: "",
          name: "Project Management Professional (PMP)",
          issuer: "",
          date: "2018",
          url: "",
        },
        {
          uuid: "",
          name: "Meta Social Media Marketing Professional Certificate",
          issuer: "Meta (Facebook)",
          date: "2019",
          url: "https://coursera.org/professional-certificates/meta-social-media-marketing",
        },
        {
          uuid: "",
          name: "AWS Fundamentals Specialization",
          issuer: "Amazon",
          url: "https://www.coursera.org/specializations/aws-fundamentals",
          date: "2022",
        },
      ],
      accomplishments: [
        {
          uuid: "",
          name: "Implemented SEO strategies for Company XYZ, boosting site traffic by 50%.",
        },
        {
          uuid: "",
          name: "Created custom CMS solutions named SuperCMS having 1000 stars on github.com",
        },
      ],
      summary: {
        asObjective: false,
        content:
          "Accomplished Programmer with extensive experience from junior to senior roles at notable tech companies. Bachelor's in Computer Science and a Master's in Software Engineering. Proven track record in leading product development, managing teams, and contributing to open-source projects. Skilled in front-end and software architecture",
      },
      interests: [
        { uuid: "", name: "Guitar playing" },
        { uuid: "", name: "Gardening" },
        { uuid: "", name: "Book reading" },
        { uuid: "", name: "Travelling" },
      ],
    },
  };
};
