import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { ResumeValues, Step } from "@/lib/types";
import {
  certificateDisplay,
  constr,
  nonEmptyAccomplishments,
  nonEmptyCertificates,
  nonEmptyEducation,
  nonEmptyInterests,
  nonEmptySkills,
  nonEmptyWork,
  skillDisplay,
} from "@/lib/templates/helpers/common";
import {
  get2ColsSpaceBetween,
  getHeaderWithLine,
  pine,
} from "@/lib/templates/helpers/pdf";
import { map, groupBy } from "lodash-es";
import { pdfStyles } from "./styles";
import { getReadableDateFromPicker } from "../utils";
import { DEFAULT_SECTION_TITLES } from "../defaults";

interface ContentProvider {
  (): Content[];
}

class ChicagoPdfTemplate {
  public values: ResumeValues;
  public constructor(values: ResumeValues) {
    this.values = values;
  }

  basics = (): Content[] => {
    const {
      resume: {
        basics: {
          location: { address },
          firstName,
          lastName,
          email,
          phone,
          url,
        },
      },
    } = this.values;

    const output: Content = [];
    pine(output, constr(" ", firstName, lastName), "heading1");
    pine(output, constr(" | ", phone, email, url), "subheading1");
    pine(output, address, "subheading1");

    return output;
  };

  accomplishments = (): Content[] => {
    const {
      resume: { accomplishments },
      meta: {
        steps: {
          accomplishments: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyAccomplishments(accomplishments);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      getHeaderWithLine(
        title.length ? title : DEFAULT_SECTION_TITLES.accomplishments
      ),
      {
        ul: map(records, (a) => a.name),
        style: "paragraph",
      },
    ];
  };

  interests = (): Content[] => {
    const {
      resume: { interests },
      meta: {
        steps: {
          interests: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyInterests(interests);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      getHeaderWithLine(
        title.length ? title : DEFAULT_SECTION_TITLES.interests
      ),
      {
        text: constr(", ", ...map(records, (i) => i.name)),
        style: "paragraph",
      },
    ];
  };

  skills: ContentProvider = () => {
    const {
      resume: { skills },
      meta: {
        steps: {
          skills: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptySkills(skills);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      getHeaderWithLine(title.length ? title : DEFAULT_SECTION_TITLES.skills),
      {
        text: constr(", ", ...map(records, skillDisplay)),
        style: "paragraph",
      },
    ];
  };

  certificates: ContentProvider = () => {
    const {
      resume: { certificates },
      meta: {
        steps: {
          certificates: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyCertificates(certificates);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      getHeaderWithLine(
        title.length ? title : DEFAULT_SECTION_TITLES.certificates
      ),
      {
        ul: map(records, certificateDisplay),
        style: "paragraph",
      },
    ];
  };

  summary = (): Content[] => {
    const {
      resume: {
        summary: { content },
      },
      meta: {
        steps: {
          summary: { title, enabled },
        },
      },
    } = this.values;
    const output: Content[] = [];

    if (!enabled || !content.trim().length) {
      return output;
    }

    output.push(
      getHeaderWithLine(title.length ? title : DEFAULT_SECTION_TITLES.summary)
    );
    output.push({ text: content, style: "paragraph" });

    return output;
  };

  education: ContentProvider = () => {
    const {
      resume: { education },
      meta: {
        steps: {
          education: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyEducation(education);

    if (!enabled || !records.length) {
      return [];
    }

    // group by employer/location
    const p1 = map(records, (w) => ({
      ...w,
      group: constr(", ", w.institution, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stack.push({ text: group, style: "heading3" });

      for (const { area, studyType, startDate, endDate, bullets } of p2[
        group
      ]) {
        stack.push(
          get2ColsSpaceBetween(
            {
              text: constr(", ", area, studyType),
              style: "heading4",
              alignment: "left",
            },
            {
              text: constr(
                " - ",
                getReadableDateFromPicker(startDate),
                getReadableDateFromPicker(endDate)
              ),
              italics: true,
              fontSize: 11,
            }
          )
        );
        stack.push({
          ul: map(bullets, (b) => b.content),
          style: "paragraph",
          marginLeft: 8,
        } satisfies Content);
      }

      stacks.push({
        stack,
        marginBottom: 8,
      });
    }

    return [
      getHeaderWithLine(
        title.length ? title : DEFAULT_SECTION_TITLES.education
      ),
      {
        stack: stacks,
        style: "paragraph",
      },
    ];
  };

  work: ContentProvider = () => {
    const {
      resume: { work },
      meta: {
        steps: {
          work: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyWork(work);

    if (!enabled || !records.length) {
      return [];
    }

    // group by employer/location
    const p1 = map(records, (w) => ({
      ...w,
      group: constr(", ", w.name, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stack.push({ text: group, style: "heading3" });

      for (const { position, startDate, endDate, bullets } of p2[group]) {
        stack.push(
          get2ColsSpaceBetween(
            { text: position, style: "heading4", alignment: "left" },
            {
              text: constr(
                " - ",
                getReadableDateFromPicker(startDate),
                getReadableDateFromPicker(endDate)
              ),
              italics: true,
              fontSize: 11,
            }
          )
        );
        stack.push({
          ul: map(bullets, (b) => b.content),
          style: "paragraph",
          marginLeft: 8,
        } satisfies Content);
      }

      stacks.push({
        stack,
        marginBottom: 8,
      });
    }

    return [
      getHeaderWithLine(title.length ? title : DEFAULT_SECTION_TITLES.work),
      {
        stack: stacks,
        style: "paragraph",
      },
    ];
  };

  public create(): Content[] {
    const order = this.values.meta.order as Step[];
    const content: Content[] = [];

    for (const step of order) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      content.push(((this as any)[step as any] as ContentProvider)());
    }
    return content;
  }
}

type DefConf = {
  isSample?: boolean;
  fontSize?: number;
};

export default function getDefinition(
  data: ResumeValues,
  { isSample = false, fontSize = 11 }: DefConf
): TDocumentDefinitions {
  const styles = pdfStyles.chicago({ fontSize });
  const struct = new ChicagoPdfTemplate(data);

  return {
    styles,
    pageSize: "LETTER",
    ...(isSample
      ? {
          watermark: { text: "Sample resume", fontSize: 60 },
        }
      : {}),
    // header: {
    //   marginTop: 2,
    //   columns: [
    //     {
    //       text: new Date().toUTCString(),
    //       alignment: "left",
    //       marginLeft: 8,
    //       fontSize: 8,
    //     },
    //     {
    //       text: "https://resumerunner.ai",
    //       link: "https://resumerunner.ai",
    //       alignment: "right",
    //       fontSize: 8,
    //       marginRight: 8,
    //     },
    //   ],
    // },
    footer: (currentPage, pageCount) => ({
      text: `${currentPage.toString()} of ${pageCount.toString()}`,
      alignment: "center",
    }),
    content: struct.create(),
  };
}
