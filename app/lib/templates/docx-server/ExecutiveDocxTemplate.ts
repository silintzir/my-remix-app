import {
  TITLE,
  constr,
  nonEmptyAccomplishments,
  nonEmptyCertificates,
  nonEmptyEducation,
  nonEmptyInterests,
  nonEmptySkills,
  nonEmptyWork,
  skillDisplay,
  splitArrayByLimit,
} from "../helpers/common";
import {
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  Paragraph,
  TextRun,
  AlignmentType,
  WidthType,
} from "docx";
import type { FileChild } from "node_modules/docx/build/file/file-child";
import { map, groupBy } from "lodash-es";
import { getReadableDateFromPicker } from "@/lib/utils";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { ChicagoDocxTemplate } from "./ChicagoDocxTemplate";
import { getDoubleHLine } from "../helpers/docx";
import { getRecordPeriod2 } from "@/lib/resume";

interface ContentProvider {
  (): FileChild[];
}

export class ExecutiveDocxTemplate extends ChicagoDocxTemplate {
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
    const paragraphs: Paragraph[] = [];

    let noSummary = false;
    if (!summaryEnabled || !content || !content.trim().length) {
      noSummary = true;
    } else {
      const title = summaryTitle.length
        ? asObjective
          ? TITLE.OBJECTIVE
          : summaryTitle
        : DEFAULT_SECTION_TITLES.summary;
      paragraphs.push(
        ...[
          this.sectionTitle(title),
          new Paragraph({ text: content, spacing: { after: 180 } }),
        ]
      );
    }

    const records = nonEmptySkills(skills);
    let noSkills = false;
    if (!skillsEnabled || !records.length) {
      noSkills = true;
    } else {
      paragraphs.push(
        new Paragraph({
          text: `–${
            skillsTitle.length ? skillsTitle : DEFAULT_SECTION_TITLES.skills
          }–`,
          style: HeadingLevel.HEADING_4,
        }),
        ...splitArrayByLimit(map(records, skillDisplay), 78).map(
          (row) =>
            new Paragraph({
              text: constr("  •  ", ...row),
              alignment: AlignmentType.CENTER,
              style: HeadingLevel.HEADING_6,
            })
        )
      );
    }
    if (noSummary && noSkills) {
      return [];
    }
    paragraphs.push(getDoubleHLine() as any);
    return paragraphs;
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
      new Paragraph({
        text: constr(" ", firstName, lastName),
        style: HeadingLevel.HEADING_1,
      }),
      new Table({
        columnWidths: [
          0.45 * ExecutiveDocxTemplate.TOTAL_TABLE_WIDTH,
          0.1 * ExecutiveDocxTemplate.TOTAL_TABLE_WIDTH,
          0.45 * ExecutiveDocxTemplate.TOTAL_TABLE_WIDTH,
        ],
        margins: { left: 0, right: 0 },
        borders: {
          insideHorizontal: {
            style: BorderStyle.NONE,
          },
          bottom: {
            size: 1,
            style: BorderStyle.SINGLE,
          },
          left: {
            size: 0,
            style: BorderStyle.NONE,
          },
          top: {
            style: BorderStyle.NONE,
          },
          right: {
            style: BorderStyle.NONE,
          },
          insideVertical: {
            style: BorderStyle.NONE,
          },
        },
        indent: {
          size: 60,
          type: WidthType.DXA,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: maskBasics ? "Marathon Staffing" : address,
                  }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: "" })],
              }),
              new TableCell({
                children: maskBasics
                  ? [
                      new Paragraph({
                        text: "Confidential document,",
                        alignment: AlignmentType.RIGHT,
                      }),
                      new Paragraph({
                        text: "not for distribution without prior permission.",
                        alignment: AlignmentType.RIGHT,
                      }),
                    ]
                  : [phone, email, url].reduce((curr, i) => {
                      if (i) {
                        curr.push(
                          new Paragraph({
                            text: i,
                            alignment: AlignmentType.RIGHT,
                          })
                        );
                      }
                      return curr;
                    }, [] as Paragraph[]),
              }),
            ],
          }),
        ],
      }),
    ] as any;
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
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.accomplishments,
        HeadingLevel.HEADING_3
      ),
      ...this.createBullets(map(records, "name")),
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
    // group by employer / location
    const p1 = map(records, (w) => ({
      ...w,
      period: getRecordPeriod2(w),
      group: constr(", ", w.name, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.work,
        HeadingLevel.HEADING_3
      )
    );

    let firstItem = true;
    for (const group in p2) {
      const stack = [];
      paragraphs.push(
        new Paragraph({
          text: constr(
            ", ",
            p2[group][0].name,
            constr(", ", p2[group][0].city, p2[group][0].state)
          ),
          style: HeadingLevel.HEADING_6,
          alignment: AlignmentType.CENTER,
          spacing: firstItem ? { before: 0 } : { before: 150 },
        })
      );
      firstItem = false;

      for (const { position, period, bullets } of p2[group]) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: position,
                bold: true,
              }),
              new TextRun({
                text: " ",
              }),
              new TextRun({
                text: period,
                // text: `(${constr(
                //   " - ",
                //   getReadableDateFromPicker(startDate),
                //   getReadableDateFromPicker(endDate)
                // )})`,
              }),
            ],
            alignment: AlignmentType.CENTER,
          })
        );
        if (bullets && bullets.length) {
          stack.push(...this.createBullets(map(bullets, "content")));
        }
      }
      paragraphs.push(...stack);
    }
    return paragraphs;
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

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.education,
        HeadingLevel.HEADING_3
      )
    );

    let firstItem = true;
    for (const r of records) {
      const { institution, studyType, area, city, state, bullets } = r;
      const period = getRecordPeriod2(r);
      paragraphs.push(
        new Paragraph({
          text: constr(
            ", ",
            studyType,
            area,
            institution,
            city,
            state + ` (${period})`
          ),
          style: HeadingLevel.HEADING_6,
          alignment: AlignmentType.CENTER,
          spacing: firstItem ? { before: 0 } : { before: 150 },
        })
      );
      firstItem = false;
      paragraphs.push(...this.createBullets(map(bullets, "content")));
    }
    return paragraphs;
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
    let firstItem = true;
    return [
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.certificates,
        HeadingLevel.HEADING_3
      ),
      ...map(records, ({ name, date, issuer, url }) => {
        const spacing = firstItem ? { before: 0 } : { before: 150 };
        firstItem = false;
        return new Paragraph({
          text: `${constr(
            " - ",
            name,
            issuer,
            url
          )} (${getReadableDateFromPicker(date)})`,
          style: HeadingLevel.HEADING_6,
          alignment: AlignmentType.CENTER,
          spacing,
        });
      }),
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
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.interests,
        HeadingLevel.HEADING_3
      ),
      ...splitArrayByLimit(map(records, "name"), 80).map(
        (row) =>
          new Paragraph({
            text: constr("  •  ", ...row),
            style: HeadingLevel.TITLE,
          })
      ),
    ];
  };

  protected sectionTitle(
    title: string,
    heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2
  ) {
    return new Paragraph({ heading, children: [new TextRun(title)] });
  }
}
