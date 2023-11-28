import { defaultResumeValues } from "./defaults";
import type { ResumeValues } from "./types";
import { mapValues } from "lodash-es";

export const sampleResume = (): ResumeValues => {
  const defaults = defaultResumeValues({ firstName: "", lastName: "", email: "" });
  return {
    meta: {
      ...defaults.meta,
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
          startDate: "2019-04-01",
          endDate: "Present",
          bullets: [
            { uuid: "", content: "Lead the development of a new product line" },
            { uuid: "", content: "Managed a team of developers" },
          ],
        },
        {
          uuid: "",
          name: "Company Two",
          position: "Software Engineer",
          startDate: "2016-06-01",
          endDate: "2019-03-31",
          bullets: [
            { uuid: "", content: "Developed a successful internal tool" },
            { uuid: "", content: "Contributed to open source projects" },
          ],
        },
        {
          uuid: "",
          name: "Company Three",
          position: "Junior Developer",
          startDate: "2014-09-01",
          endDate: "2016-05-31",
          bullets: [
            { uuid: "", content: "Worked on front-end development" },
            { uuid: "", content: "Participated in product design brainstorming sessions" },
          ],
        },
      ],
      education: [
        {
          uuid: "",
          institution: "University A",
          area: "Computer Science",
          studyType: "Bachelor",
          startDate: "2010-08-01",
          endDate: "2014-05-01",
          bullets: [
            { uuid: "", content: "CS101 - Intro to Computer Science" },
            { uuid: "", content: "CS102 - Advanced Algorithms" },
          ],
        },
        {
          uuid: "",
          institution: "University B",
          area: "Software Engineering",
          studyType: "Masters",
          startDate: "2014-09-01",
          endDate: "2016-05-01",
          bullets: [
            { uuid: "", content: "SE201 - Software Engineering Principles" },
            { uuid: "", content: "SE202 - Software Architecture" },
          ],
        },
      ],
      skills: [],
      certificates: [],
      accomplishments: [],
      interests: [],
      summary: { asObjective: false, content: "" },
    },
  };
};
