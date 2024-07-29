import type { Content } from "pdfmake/interfaces";
import {
  TITLE,
  conobj,
  constr,
  createTwoDimArray,
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
  getDoubleHLine,
} from "@/lib/templates/helpers/pdf";
import { map, groupBy } from "lodash-es";
import { getReadableDateFromPicker } from "../../utils";
import { DEFAULT_SECTION_TITLES } from "../../defaults";
import type { ContentProvider } from "../pdf.client";
import { ChicagoPdfTemplate } from "./ChicagoPdfTemplate";
import { getRecordPeriod2 } from "@/lib/resume";

export class AccountantPdfTemplate extends ChicagoPdfTemplate {
  summary: ContentProvider = () => {
    const {
      resume: {
        summary: { content, asObjective },
        skills,
      },
      meta: {
        steps: {
          summary: { title: summaryTitle, enabled: summaryEnabled },
          skills: { title: skillsTitle, enabled: skillsEnabled },
        },
      },
    } = this.values;
    const output: Content[] = [];

    let noSummary = false;
    if (!summaryEnabled || !content || !content.trim().length) {
      noSummary = true;
    } else {
      output.push({
        text: summaryTitle.length
          ? asObjective
            ? TITLE.OBJECTIVE
            : summaryTitle
          : DEFAULT_SECTION_TITLES.summary,
        style: "heading2",
      });
      output.push({ text: content, style: "paragraph", marginBottom: 0 });
    }

    const records = nonEmptySkills(skills);
    let noSkills = false;
    if (!skillsEnabled || !records.length) {
      noSkills = true;
    } else {
      if (noSummary) {
        output.push({
          text: skillsTitle.length
            ? skillsTitle
            : DEFAULT_SECTION_TITLES.skills,
          style: "heading2",
        });
      }
      output.push({
        marginTop: 0,
        marginBottom: 0,
        table: {
          widths: ["*"],
          body: [
            [
              {
                columns: createTwoDimArray(records.map(skillDisplay), 3).map(
                  (column) => [
                    column.map((entry) => [
                      {
                        text: `√   ${entry}`,
                        style: "cellContent",
                        margin: [0, 0, 4, 4],
                      },
                    ]),
                  ]
                ),
              },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      });
    }
    if (noSummary && noSkills) {
      return [];
    }
    output.push(getDoubleHLine(0.7, 8, 0));
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
      period: getRecordPeriod2(w),
      group: constr(", ", w.name, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      for (const { name, position, city, state, period, bullets } of p2[
        group
      ]) {
        stack.push(
          get2ColsSpaceBetween(
            conobj(
              { text: ", " },
              { text: position, bold: true },
              { text: constr(", ", name, city, state) }
            ),
            { text: period },
            0,
            0,
            "80%"
          )
        );
        if (bullets && bullets.length) {
          stack.push({
            ul: bullets.map((b) => ({ text: b.content })),
            margin: [12, 0, 0, 0],
          } satisfies Content);
        }
      }

      stacks.push({
        stack,
        marginTop: 8,
      });
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.work,
        style: "heading3",
        marginTop: 12,
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
    const output = [];

    for (const r of records) {
      const { institution, studyType, area, city, state, bullets } = r;

      const period = getRecordPeriod2(r);

      output.push(
        get2ColsSpaceBetween(
          conobj(
            { text: ", " },
            {
              text: constr(", ", institution, studyType, area),
              bold: true,
            },
            { text: constr(", ", city, state) }
          ),
          {
            text: period,
          },
          8,
          0,
          "80%"
        )
      );
      if (bullets && bullets.length) {
        output.push({
          ul: bullets.map((b) => ({ text: b.content })),
          margin: [12, 0, 0, 0],
        } satisfies Content);
      }
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.education,
        style: "heading3",
        marginTop: 12,
      },
      {
        stack: output,
        style: "paragraph",
      },
    ];
  };
  skills: ContentProvider = () => [];
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
        text: title.length ? title : DEFAULT_SECTION_TITLES.certificates,
        style: "heading3",
        marginTop: 12,
      },
      {
        stack: map(records, ({ name, issuer, date, url }) =>
          get2ColsSpaceBetween(
            conobj(
              { text: ", " },
              { text: name, bold: true },
              { text: constr(", ", issuer, url) }
            ),
            {
              text: getReadableDateFromPicker(date),
            },
            8,
            0,
            "80%"
          )
        ),
        style: "paragraph",
      },
    ];
  };
  accomplishments: ContentProvider = () => {
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
        text: title.length ? title : DEFAULT_SECTION_TITLES.accomplishments,
        style: "heading3",
        marginTop: 12,
      },
      {
        marginTop: 0,
        marginBottom: 0,
        table: {
          widths: ["*"],
          body: [
            [
              records.map((r) => ({
                columns: [
                  {
                    text: "√",
                    style: "cellContent",
                    width: "3%",
                  },
                  {
                    text: r.name,
                    style: "cellContent",
                    width: "97%",
                    margin: [0, 0, 10, 4],
                  },
                ],
              })),
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
    ];
  };
  interests: ContentProvider = () => {
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
        text: title.length ? title : DEFAULT_SECTION_TITLES.interests,
        style: "heading3",
        marginTop: 12,
      },
      {
        marginTop: 6,
        marginBottom: 0,
        table: {
          widths: ["*"],
          body: [
            [
              {
                columns: createTwoDimArray(
                  records.map((r) => r.name),
                  3
                ).map((column) => ({
                  ul: column.map((entry) => [
                    {
                      text: entry,
                      style: "cellContent",
                      margin: [0, 0, 4, 4],
                    },
                  ]),
                })),
              },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
    ];
  };
  basics: ContentProvider = () => {
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

    return [
      {
        marginTop: 6,
        marginBottom: 0,
        table: {
          widths: ["*"],
          body: [
            [
              {
                alignment: "justify",
                columns: [
                  {
                    text: constr(" ", firstName, lastName),
                    style: "heading1",
                    width: "54%",
                  },
                  {
                    text: maskBasics
                      ? "\nMarathon Staffing\n Confidential document, not for distribution without prior permission."
                      : `\n${address}\n${constr(" | ", phone, email, url)}`,
                    style: "headerRight",
                    width: "46%",
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
          paddingBottom: () => 0,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
      getDoubleHLine(0.7, 0, 12),
    ];
  };
}
