import type { Content } from "pdfmake/interfaces";
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
import { map, groupBy } from "lodash-es";
import { getReadableDateFromPicker } from "../../utils";
import { DEFAULT_SECTION_TITLES } from "../../defaults";
import { ContentProvider } from "../pdf.client";
import { ChicagoPdfTemplate } from "./ChicagoPdfTemplate";

export class ExecutivePdfTemplate extends ChicagoPdfTemplate {
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

    output.push({
      text: (title.length
        ? asObjective
          ? "Objective"
          : "Summary"
        : DEFAULT_SECTION_TITLES.summary
      ).toUpperCase(),
      style: "heading2",
    });
    output.push({ text: content, style: "paragraph", marginBottom: 12 });

    return output;
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
      stacks.push({
        text: constr(
          ", ",
          p2[group][0].name,
          constr(", ", p2[group][0].city, p2[group][0].state)
        ),
        style: "heading3",
      } satisfies Content);

      for (const { position, startDate, endDate, bullets } of p2[group]) {
        stacks.push({
          text: [
            { text: position, bold: true },
            { text: ", " },
            {
              text: constr(
                " - ",
                getReadableDateFromPicker(startDate),
                getReadableDateFromPicker(endDate)
              ),
            },
          ],
        });
        stack.push(
          map(bullets, (b) => {
            return {
              text: b.content,
            };
          })
        );
      }

      stacks.push({
        stack,
        marginBottom: 8,
      });
    }

    return [
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.work
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
      },
      {
        stack: stacks,
        style: "paragraph",
      },
    ];
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
      stacks.push({
        text: constr(
          ", ",
          p2[group][0].institution,
          constr(", ", p2[group][0].city, p2[group][0].state)
        ),
        style: "heading3",
      } satisfies Content);

      for (const { area, studyType, startDate, endDate, bullets } of p2[
        group
      ]) {
        stacks.push({
          text: [
            { text: constr(", ", area, studyType), bold: true },
            { text: ", " },
            {
              text: constr(
                " - ",
                getReadableDateFromPicker(startDate),
                getReadableDateFromPicker(endDate)
              ),
            },
          ],
        });
        stack.push(
          map(bullets, (b) => {
            return {
              text: b.content,
            };
          })
        );
      }

      stacks.push({
        stack,
        marginBottom: 8,
      });
    }

    return [
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.education
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
      },
      {
        stack: stacks,
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
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.skills
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
      },
      {
        text: constr(", ", ...map(records, skillDisplay)),
        style: "paragraph",
        marginBottom: 12,
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
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.certificates
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
      },
      ...map(records, (r) => {
        return { text: certificateDisplay(r, " - "), style: "paragraph" };
      }),
    ];
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
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.accomplishments
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
        marginTop: 12,
      },
      ...map(records, (r) => ({
        text: r.name,
        style: "paragraph",
      })),
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
      {
        text: (title.length
          ? title
          : DEFAULT_SECTION_TITLES.interests
        ).toUpperCase(),
        style: "heading2",
        marginBottom: 4,
        marginTop: 12,
      },
      {
        text: constr(", ", ...map(records, (i) => i.name)),
        style: "paragraph",
      },
    ];
  };
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

    return [
      {
        text: constr(" ", firstName, lastName),
        style: "heading1",
      },
      {
        marginTop: 6,
        marginBottom: 12,
        table: {
          widths: ["*"],
          body: [
            [
              {
                alignment: "justify",
                columns: [
                  { text: address, alignment: "left", width: "35%" },
                  { text: "", alignment: "center", width: "30%" },
                  {
                    text: constr(" | ", phone, email, url),
                    alignment: "right",
                    width: "35%",
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 4,
          hLineWidth: (i) => (i === 1 ? 1 : 0),
          vLineWidth: () => 0,
        },
      },
    ];
  };
}
