import {
  TITLE,
  constr,
  createTwoDimArray,
  nonEmptyAccomplishments,
  nonEmptyCertificates,
  nonEmptyEducation,
  nonEmptyInterests,
  nonEmptySkills,
  nonEmptyWork,
  skillDisplay,
} from "../helpers/common";
import {
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  Paragraph,
  TextRun,
  WidthType,
  AlignmentType,
} from "docx";
import type { FileChild } from "node_modules/docx/build/file/file-child";
import { map, groupBy } from "lodash-es";
import { getReadableDateFromPicker } from "@/lib/utils";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { ChicagoDocxTemplate } from "./ChicagoDocxTemplate";
import { addBottomDoubleHLine } from "../helpers/docx";
import { getRecordPeriod2 } from "@/lib/resume";
import { ExecutiveDocxTemplate } from "./ExecutiveDocxTemplate";

interface ContentProvider {
  (): FileChild[];
}

export class AccountantDocxTemplate extends ExecutiveDocxTemplate {
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
      if (noSummary) {
        paragraphs.push(
          this.sectionTitle(
            skillsTitle.length ? skillsTitle : DEFAULT_SECTION_TITLES.skills
          )
        );
      }
      const width = ChicagoDocxTemplate.TOTAL_TABLE_WIDTH / 3;
      paragraphs.push(
        new Table({
          columnWidths: [width, width, width],
          margins: { left: 0 },
          borders: {
            insideHorizontal: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            top: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: createTwoDimArray(records.map(skillDisplay), 3).map(
                (column) =>
                  new TableCell({
                    width: {
                      size: ChicagoDocxTemplate.TOTAL_TABLE_WIDTH,
                      type: WidthType.DXA,
                    },
                    children: column.map(
                      (entry) =>
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [new TextRun({ text: `√   ${entry}` })],
                          spacing: { before: 90 },
                        })
                    ),
                  })
              ),
            }),
          ],
        }) as any
      );
    }
    if (noSummary && noSkills) {
      return [];
    }
    return [
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "", size: 0.6 * this.fontSize })],
      }),
      addBottomDoubleHLine(paragraphs, 0, 0, 150),
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

    const LEFT_COLUMN_WIDTH_FRACTION = 0.49;
    const MIDDLE_COLUMN_WIDTH_FRACTION = 0.02;
    const leftWidth =
      LEFT_COLUMN_WIDTH_FRACTION * ChicagoDocxTemplate.TOTAL_TABLE_WIDTH;
    const middleWidth =
      MIDDLE_COLUMN_WIDTH_FRACTION * ChicagoDocxTemplate.TOTAL_TABLE_WIDTH;
    const rightWidth =
      ChicagoDocxTemplate.TOTAL_TABLE_WIDTH - leftWidth - middleWidth;

    return [
      addBottomDoubleHLine(
        [
          new Table({
            columnWidths: [leftWidth, middleWidth, rightWidth],
            margins: { left: 0 },
            borders: {
              insideHorizontal: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            indent: {
              size: 60,
              type: WidthType.DXA,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: leftWidth,
                      type: WidthType.DXA,
                    },
                    children: [
                      new Paragraph({
                        text: constr(" ", firstName, lastName),
                        style: HeadingLevel.HEADING_1,
                      }),
                    ],
                  }),
                  new TableCell({
                    width: {
                      size: middleWidth,
                      type: WidthType.DXA,
                    },
                    children: [new Paragraph({ text: "" })],
                  }),
                  new TableCell({
                    width: {
                      size: rightWidth,
                      type: WidthType.DXA,
                    },
                    children: [
                      new Paragraph({
                        text: "",
                        style: HeadingLevel.HEADING_6,
                      }),
                      new Paragraph({
                        text: maskBasics ? "Marathon Staffing" : address,
                        style: HeadingLevel.HEADING_6,
                      }),
                      new Paragraph({
                        text: maskBasics
                          ? "Confidential document, not for distribution without prior permission."
                          : constr(" | ", phone, email, url),
                        style: HeadingLevel.HEADING_6,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ] as any,
        undefined,
        undefined,
        60
      ),
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
    const leftWidth = 0.04 * ChicagoDocxTemplate.TOTAL_TABLE_WIDTH;
    const rightWidth = ChicagoDocxTemplate.TOTAL_TABLE_WIDTH - leftWidth;
    return [
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.accomplishments,
        HeadingLevel.HEADING_3
      ),
      new Table({
        columnWidths: [leftWidth, rightWidth],
        margins: {
          left: 0,
        },
        borders: {
          insideHorizontal: {
            style: BorderStyle.NONE,
          },
          bottom: {
            size: 0,
            style: BorderStyle.NONE,
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
        rows: records.map(
          (i) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: leftWidth, type: WidthType.DXA },
                  children: [
                    new Paragraph({ text: " √", spacing: { before: 150 } }),
                  ],
                }),
                new TableCell({
                  width: { size: rightWidth, type: WidthType.DXA },
                  children: [
                    new Paragraph({ text: i.name, spacing: { before: 150 } }),
                  ],
                }),
              ],
            })
        ),
      }),
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
      group: constr(", ", w.name, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.work,
        HeadingLevel.HEADING_3
      )
    );

    for (const group in p2) {
      let firstItemInGroup = true;
      for (const { name, position, city, state, period, bullets } of p2[
        group
      ]) {
        paragraphs.push(
          this.get2ColsSpaceBetween(
            [
              new TextRun({
                text: position,
                bold: true,
              }),
              new TextRun({
                text: ", ",
              }),
              new TextRun({ text: constr(", ", name, city, state) }),
            ],
            [new TextRun({ text: period })],
            undefined,
            undefined,
            0.76,
            firstItemInGroup ? 100 : 0
          )
        );
        paragraphs.push(...this.createBullets(map(bullets, "content")));
        firstItemInGroup = false;
      }
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

    for (const r of records) {
      const { institution, studyType, area, city, state, bullets } = r;
      const period = getRecordPeriod2(r);
      paragraphs.push(
        this.get2ColsSpaceBetween(
          [
            new TextRun({
              text: constr(", ", institution, studyType, area),
              bold: true,
            }),
            new TextRun({
              text: ", ",
              bold: true,
            }),
            new TextRun({ text: constr(", ", city, state) }),
          ],
          [
            new TextRun({
              text: period,
            }),
          ],
          undefined,
          undefined,
          0.76,
          150
        )
      );
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
    return [
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.certificates,
        HeadingLevel.HEADING_3
      ),
      ...map(records, ({ name, date, issuer, url }) => {
        return this.get2ColsSpaceBetween(
          [
            new TextRun({
              text: name,
              bold: true,
            }),
            new TextRun({
              text: ", ",
              bold: true,
            }),
            new TextRun({ text: constr(", ", issuer, url) }),
          ],
          [
            new TextRun({
              text: getReadableDateFromPicker(date),
            }),
          ],
          undefined,
          undefined,
          undefined,
          150
        );
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
    const width = ChicagoDocxTemplate.TOTAL_TABLE_WIDTH / 3;
    return [
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.interests,
        HeadingLevel.HEADING_3
      ),
      new Table({
        columnWidths: [width, width, width],
        margins: {
          left: 0,
        },
        borders: {
          insideHorizontal: {
            style: BorderStyle.NONE,
          },
          bottom: {
            size: 0,
            style: BorderStyle.NONE,
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
            children: createTwoDimArray(
              records.map((i) => i.name),
              3
            ).map(
              (column) =>
                new TableCell({
                  width: { size: width, type: WidthType.DXA },
                  children: this.createBullets(column, 0, { before: 90 }),
                })
            ),
          }),
        ],
      }) as any,
    ];
  };
}
