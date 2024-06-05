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
} from "../helpers/common";
import type { ResumeValues, Step } from "@/lib/types";
import {
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  Paragraph,
  TextRun,
  WidthType,
} from "docx";
import type { FileChild } from "node_modules/docx/build/file/file-child";
import { map, groupBy, take } from "lodash-es";
import { getReadableDateFromPicker } from "../../utils";
import { DEFAULT_SECTION_TITLES } from "../../defaults";
import { getRecordPeriod2 } from "@/lib/resume";

interface ContentProvider {
  (): FileChild[];
}

export class ChicagoDocxTemplate {
  public values: ResumeValues;
  protected fontSize: number;
  public constructor(values: ResumeValues, fontSize: number) {
    this.values = values;
    this.fontSize = fontSize;
  }

  public static TOTAL_TABLE_WIDTH = 10900;

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
    return maskBasics
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun(constr(" ", firstName, lastName))],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: TITLE.COMPANY_NAME })],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: TITLE.CONFIDENTIALITY_INFO,
                italics: true,
              }),
            ],
          }),
        ]
      : ([
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun(constr(" ", firstName, lastName))],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: address })],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: constr(" | ", phone, email, url),
                italics: true,
              }),
            ],
          }),
        ] satisfies FileChild[]);
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
        title.length ? title : DEFAULT_SECTION_TITLES.accomplishments
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
      group: constr(", ", w.name, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(title.length ? title : DEFAULT_SECTION_TITLES.work)
    );

    for (const group in p2) {
      paragraphs.push(
        this.get2ColsSpaceBetween(
          [
            new TextRun({
              text: p2[group][0].name,
            }),
          ],
          [
            new TextRun({
              text: constr(", ", p2[group][0].city, p2[group][0].state),
            }),
          ],
          HeadingLevel.HEADING_3,
          HeadingLevel.HEADING_3,
          0.72,
          120
        )
      );

      for (const { position, period, bullets } of p2[group]) {
        paragraphs.push(
          this.get2ColsSpaceBetween(
            [new TextRun({ text: position, italics: true })],
            [new TextRun({ text: period })],
            HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_4
          )
        );
        paragraphs.push(...this.createBullets(map(bullets, "content")));
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
    // group by employer / location
    const p1 = map(records, (w) => ({
      ...w,
      period: getRecordPeriod2(w),
      group: constr(", ", w.institution, w.city),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(title.length ? title : DEFAULT_SECTION_TITLES.education)
    );

    for (const group in p2) {
      paragraphs.push(
        this.get2ColsSpaceBetween(
          [
            new TextRun({
              text: p2[group][0].institution,
              bold: true,
            }),
          ],
          [
            new TextRun({
              text: constr(", ", p2[group][0].city, p2[group][0].state),
              bold: true,
            }),
          ],
          HeadingLevel.HEADING_3,
          HeadingLevel.HEADING_3,
          0.72,
          120
        )
      );

      for (const { area, studyType, period, bullets } of p2[group]) {
        paragraphs.push(
          this.get2ColsSpaceBetween(
            [
              new TextRun({
                text: constr(", ", area, studyType),
                italics: true,
              }),
            ],
            [new TextRun({ text: period })],
            HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_4
          )
        );
        paragraphs.push(...this.createBullets(map(bullets, "content")));
      }
    }

    return paragraphs;
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
      this.sectionTitle(title.length ? title : DEFAULT_SECTION_TITLES.skills),
      new Paragraph({
        heading: HeadingLevel.HEADING_6,
        spacing: { before: 120 },
        indent: { left: 60 },
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
      }),
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
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.certificates
      ),
      ...map(records, ({ name, date, issuer, url }) => {
        const firstLine = [];
        if (name.trim().length) {
          firstLine.push(name);
        }
        if (date.trim().length) {
          firstLine.push(`[${getReadableDateFromPicker(date)}]`);
        }
        const second = constr(" - ", issuer, url);
        const first = firstLine.join(" ");
        return new Paragraph({
          heading: HeadingLevel.HEADING_5,
          bullet: {
            level: 0,
          },
          children: [
            ...(first.length
              ? [new TextRun({ style: HeadingLevel.HEADING_6, text: first })]
              : []),
            ...(second.length
              ? [
                  new TextRun({
                    style: HeadingLevel.HEADING_6,
                    text: second,
                    break: 1,
                  }),
                ]
              : []),
          ],
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
        title.length ? title : DEFAULT_SECTION_TITLES.interests
      ),
      new Paragraph({
        heading: HeadingLevel.HEADING_6,
        spacing: { before: 120 },
        indent: { left: 60 },
        text: constr(", ", ...map(records, "name")),
      }),
    ];
  };
  summary: ContentProvider = () => {
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

    if (!enabled || !content || !content.trim().length) {
      return [];
    }

    return [
      this.sectionTitle(
        title.length
          ? asObjective
            ? TITLE.OBJECTIVE
            : title
          : DEFAULT_SECTION_TITLES.summary
      ),
      new Paragraph({
        heading: HeadingLevel.HEADING_6,
        text: content,
        indent: { left: 60 },
        spacing: {
          before: 100,
          after: 0,
        },
      }),
    ];
  };

  create(): FileChild[] {
    const order = this.values.meta.order as Step[];
    const children: FileChild[] = [];

    for (const step of order) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      children.push(...((this as any)[step as any] as ContentProvider)());
    }

    return children;
  }

  protected createBullets(
    bullets: string[],
    level = 0,
    spacing: { before?: number; after?: number } = { before: 0 }
  ) {
    return map(
      bullets,
      (bullet) =>
        new Paragraph({
          heading: HeadingLevel.HEADING_5,
          bullet: { level },
          spacing,
          children: [
            new TextRun({
              text: bullet,
              style: HeadingLevel.HEADING_6,
            }),
          ],
        })
    );
  }

  protected sectionTitle(
    title: string,
    heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_2
  ) {
    return new Table({
      columnWidths: [ChicagoDocxTemplate.TOTAL_TABLE_WIDTH],
      margins: { left: 0, right: 0 },
      borders: {
        insideHorizontal: {
          style: BorderStyle.NONE,
        },
        bottom: {
          style: BorderStyle.NONE,
        },
        left: {
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
              width: {
                size: ChicagoDocxTemplate.TOTAL_TABLE_WIDTH,
                type: WidthType.DXA,
              },
              borders: {
                bottom: {
                  size: 1,
                  style: BorderStyle.SINGLE,
                },
                left: {
                  style: BorderStyle.NONE,
                },
                top: {
                  style: BorderStyle.NONE,
                },
                right: {
                  style: BorderStyle.NONE,
                },
              },
              children: [
                new Paragraph({ heading, children: [new TextRun(title)] }),
              ],
            }),
          ],
        }),
      ],
    }) as any;
  }

  protected get2ColsSpaceBetween(
    left: TextRun[],
    right: TextRun[],
    hLeft?: any,
    hRight?: any,
    leftWidthFraction = 0.7,
    spacingBefore = 0
  ) {
    const MIDDLE_COLUMN_WIDTH_FRACTION = 0.02;
    const leftWidth = leftWidthFraction * ChicagoDocxTemplate.TOTAL_TABLE_WIDTH;
    const middleWidth =
      MIDDLE_COLUMN_WIDTH_FRACTION * ChicagoDocxTemplate.TOTAL_TABLE_WIDTH;
    const rightWidth =
      ChicagoDocxTemplate.TOTAL_TABLE_WIDTH - leftWidth - middleWidth;
    return new Table({
      columnWidths: [leftWidth, middleWidth, rightWidth],
      margins: { left: 0, right: 0 },
      borders: {
        insideHorizontal: {
          style: BorderStyle.NONE,
        },
        bottom: {
          style: BorderStyle.NONE,
        },
        left: {
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
              width: { size: leftWidth, type: WidthType.DXA },
              children: [
                new Paragraph({
                  ...(hLeft ? { heading: hLeft } : {}),
                  alignment: AlignmentType.LEFT,
                  children: left,
                  spacing: { before: spacingBefore },
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
                  ...(hRight ? { heading: hRight } : {}),
                  alignment: AlignmentType.RIGHT,
                  children: right,
                  spacing: { before: spacingBefore },
                }),
              ],
            }),
          ],
        }),
      ],
    }) as any;
  }
}
