import { constr, skillDisplay } from "@/lib/templates/helpers/common";
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
import { map, groupBy } from "lodash-es";

interface ContentProvider {
  (): FileChild[];
}

export class ChicagoDocxTemplate {
  public values: ResumeValues;
  public constructor(values: ResumeValues) {
    this.values = values;
  }

  basics: ContentProvider = () => {
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
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun(constr(" ", firstName, lastName))],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun(constr(" | ", phone, email, url))],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun(address)],
      }),
    ] satisfies FileChild[];
  };
  accomplishments: ContentProvider = () => {
    const {
      resume: { accomplishments },
      meta: {
        steps: {
          accomplishments: { title },
        },
      },
    } = this.values;
    if (!accomplishments.length) {
      return [];
    }
    return [
      this.sectionTitle(title),
      ...this.createBullets(map(accomplishments, "name")),
    ];
  };
  work: ContentProvider = () => {
    const {
      resume: { work },
      meta: {
        steps: {
          work: { title },
        },
      },
    } = this.values;

    if (!work.length) {
      return [];
    }
    // group by employer / location
    const p1 = map(work, (w) => ({
      ...w,
      group: constr(", ", w.name, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(this.sectionTitle(title));

    for (const group in p2) {
      paragraphs.push(this.sectionTitle(group, HeadingLevel.HEADING_3));

      for (const { position, startDate, endDate, bullets } of p2[group]) {
        paragraphs.push(
          this.twoColumns(
            [new TextRun({ text: position, bold: true, italics: true })],
            [
              new TextRun({
                text: constr(" - ", startDate, endDate),
                italics: true,
              }),
            ]
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
          education: { title },
        },
      },
    } = this.values;

    if (!education.length) {
      return [];
    }
    // group by employer / location
    const p1 = map(education, (w) => ({
      ...w,
      group: constr(", ", w.institution, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(this.sectionTitle(title));

    for (const group in p2) {
      paragraphs.push(this.sectionTitle(group, HeadingLevel.HEADING_3));

      for (const { area, studyType, startDate, endDate, bullets } of p2[
        group
      ]) {
        paragraphs.push(
          this.twoColumns(
            [
              new TextRun({
                text: constr(", ", area, studyType),
                bold: true,
                italics: true,
              }),
            ],
            [
              new TextRun({
                text: constr(" - ", startDate, endDate),
                italics: true,
              }),
            ]
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
          skills: { title },
        },
      },
    } = this.values;
    if (!skills.length) {
      return [];
    }
    return [
      this.sectionTitle(title),
      ...this.createBullets(map(skills, skillDisplay)),
    ];
  };

  certificates: ContentProvider = () => {
    const {
      resume: { certificates },
      meta: {
        steps: {
          certificates: { title },
        },
      },
    } = this.values;
    if (!certificates.length) {
      return [];
    }
    return [
      this.sectionTitle(title),
      ...map(certificates, ({ name, date, issuer, url }) => {
        const firstLine = [];
        if (name.trim().length) {
          firstLine.push(name);
        }
        if (date.trim().length) {
          firstLine.push(`[${date}]`);
        }
        const second = constr(" - ", issuer, url);
        const first = firstLine.join(" ");
        return new Paragraph({
          bullet: {
            level: 0,
          },
          children: [
            ...(first.length ? [new TextRun({ text: first })] : []),
            ...(second.length ? [new TextRun({ text: second, break: 1 })] : []),
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
          interests: { title },
        },
      },
    } = this.values;
    if (!interests.length) {
      return [];
    }
    return [
      this.sectionTitle(title),
      new Paragraph({ text: constr(", ", ...map(interests, "name")) }),
    ];
  };
  summary: ContentProvider = () => {
    return [];
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
  private createBullets(bullets: string[]) {
    return map(
      bullets,
      (bullet) => new Paragraph({ text: bullet, bullet: { level: 0 } })
    );
  }

  private sectionTitle(
    title: string,
    heading: HeadingLevel = HeadingLevel.HEADING_2
  ) {
    return new Paragraph({
      heading,
      children: [new TextRun(title)],
    });
  }

  private twoColumns(left: TextRun[], right: TextRun[]) {
    return new Table({
      columnWidths: [5400, 5400],
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
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: left,
                }),
              ],
            }),
            new TableCell({
              width: {
                size: 4505,
                type: WidthType.DXA,
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: right,
                }),
              ],
            }),
          ],
        }),
      ],
    }) as any;
  }
}
