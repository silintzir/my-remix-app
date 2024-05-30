import type { Content } from "pdfmake/interfaces";
import type { ResumeValues, Step } from "@/lib/types";
import {
  TITLE,
  certificateDisplay2,
  constr,
  nonEmptyAccomplishments,
  nonEmptyCertificates,
  nonEmptyEducation,
  nonEmptyInterests,
  nonEmptySkills,
  nonEmptyWork,
  skillDisplay,
} from "../helpers/common";
import { get2ColsSpaceBetween, getHeaderWithLine, pine } from "../helpers/pdf";
import { map, groupBy, take } from "lodash-es";
import { DEFAULT_SECTION_TITLES } from "../../defaults";
import type { ContentProvider } from "../pdf.client";
import { getRecordPeriod2 } from "@/lib/resume";

export class ChicagoPdfTemplate {
  public values: ResumeValues;
  public constructor(values: ResumeValues) {
    this.values = values;
  }

  basics = (): Content[] => {
    const {
      meta: { maskBasics },
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
    if (maskBasics) {
      pine(output, constr(" ", firstName, lastName), "heading1");
      pine(output, TITLE.COMPANY_NAME, "subheading1");
      pine(output, TITLE.CONFIDENTIALITY_INFO, "subheading2");
    } else {
      pine(output, constr(" ", firstName, lastName), "heading1");
      pine(output, address, "subheading1");
      pine(output, constr(" | ", phone, email, url), "subheading2");
    }

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
        text:
          constr(
            ", ",
            ...map(
              take(
                records,
                records.length > 1 ? records.length - 1 : records.length
              ),
              skillDisplay
            )
          ) +
          (records.length > 1
            ? ` and ${skillDisplay(records[records.length - 1])}`
            : ""),
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
        text:
          constr(
            ", ",
            ...map(
              take(
                records,
                records.length > 1 ? records.length - 1 : records.length
              ),
              certificateDisplay2
            )
          ) +
          (records.length > 1
            ? ` and ${certificateDisplay2(records[records.length - 1])}`
            : ""),
        style: "paragraph",
      },
    ];
  };

  summary = (): Content[] => {
    const {
      resume: {
        summary: { content, asObjective },
      },
      meta: {
        steps: {
          summary: { title, enabled },
        },
      },
    } = this.values;
    const output: Content[] = [];

    if (!enabled || !content || !content.trim().length) {
      return output;
    }

    output.push(
      getHeaderWithLine(
        title.length
          ? asObjective
            ? TITLE.OBJECTIVE
            : title
          : DEFAULT_SECTION_TITLES.summary
      )
    );
    output.push({ text: content, style: "paragraph", marginBottom: 8 });

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
      period: getRecordPeriod2(w),
      group: constr(", ", w.institution, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stack.push(
        get2ColsSpaceBetween(
          {
            text: p2[group][0].institution,
            style: "heading3",
            alignment: "left",
          },
          {
            text: p2[group][0].city,
            style: "heading3",
            alignment: "right",
          },
          0
        )
      );

      for (const { area, studyType, period, bullets } of p2[group]) {
        stack.push(
          get2ColsSpaceBetween(
            {
              text: constr(", ", area, studyType),
              style: "heading4",
              alignment: "left",
            },
            {
              text: period,
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
      period: getRecordPeriod2(w),
      group: constr(", ", w.name, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stack.push(
        get2ColsSpaceBetween(
          {
            text: p2[group][0].name,
            style: "heading3",
            alignment: "left",
          },
          {
            text: p2[group][0].city,
            style: "heading3",
            alignment: "right",
          },
          2
        )
      );

      for (const { position, period, bullets } of p2[group]) {
        stack.push(
          get2ColsSpaceBetween(
            { text: position, style: "heading4", alignment: "left" },
            { text: period }
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
