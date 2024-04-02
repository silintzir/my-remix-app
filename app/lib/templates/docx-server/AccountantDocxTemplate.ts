import {
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
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  Paragraph,
  TextRun,
} from "docx";
import type { FileChild } from "node_modules/docx/build/file/file-child";
import { map, groupBy, isUndefined } from "lodash-es";
import { getReadableDateFromPicker } from "@/lib/utils";
import { DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { ChicagoDocxTemplate } from "./ChicagoDocxTemplate";
import { getDoubleHLine } from "../helpers/docx";

interface ContentProvider {
  (): FileChild[];
}

export class AccountantDocxTemplate extends ChicagoDocxTemplate {
  summary: ContentProvider = () => {
    const {
      resume: {
        summary: { content, asObjective },
        skills,
      },
      meta: {
        steps: {
          summary: { title: summaryTitle, enabled: summaryEnabled },
          skills: { enabled: skillsEnabled },
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
          ? "Objective"
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
        new Table({
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
              children: createTwoDimArray(records.map(skillDisplay), 3).map(
                (column) =>
                  new TableCell({
                    children: column.map(
                      (entry) =>
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `√   ${entry}`,
                            }),
                          ],
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
      new Table({
        columnWidths: [5800, 5000],
        margins: {
          left: 0,
        },
        borders: {
          insideHorizontal: {
            style: BorderStyle.NONE,
          },
          bottom: {
            size: 1,
            style: BorderStyle.DOUBLE,
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
                    text: maskBasics
                      ? "Marathon Staffing"
                      : constr(" ", firstName, lastName),
                    style: HeadingLevel.HEADING_1,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "",
                    style: HeadingLevel.HEADING_6,
                  }),
                  new Paragraph({
                    text: maskBasics ? "Confidential document," : address,
                    style: HeadingLevel.HEADING_6,
                  }),
                  new Paragraph({
                    text: maskBasics
                      ? "not for distribution without prior permission."
                      : constr(" | ", phone, email, url),
                    style: HeadingLevel.HEADING_6,
                  }),
                ],
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
      new Table({
        columnWidths: [300, 10500],
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
                  children: [
                    new Paragraph({ text: "√", spacing: { before: 150 } }),
                  ],
                }),
                new TableCell({
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

    for (const group in p2) {
      let firstItemInGroup = true;
      for (const {
        name,
        position,
        city,
        state,
        startDate,
        endDate,
        bullets,
      } of p2[group]) {
        paragraphs.push(
          this.twoColumns(
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
            [
              new TextRun({
                text: constr(
                  " — ",
                  getReadableDateFromPicker(startDate),
                  getReadableDateFromPicker(endDate)
                ),
              }),
            ],
            undefined,
            undefined,
            8640,
            2160,
            firstItemInGroup ? 200 : 0
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
    // group by employer / location
    const p1 = map(records, (w) => ({
      ...w,
      group: constr(", ", w.institution, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.education,
        HeadingLevel.HEADING_3
      )
    );

    for (const {
      institution,
      studyType,
      area,
      city,
      state,
      startDate,
      endDate,
      bullets,
    } of records) {
      paragraphs.push(
        this.twoColumns(
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
              text: constr(
                " — ",
                getReadableDateFromPicker(startDate),
                getReadableDateFromPicker(endDate)
              ),
            }),
          ],
          undefined,
          undefined,
          8640,
          2160,
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
        return this.twoColumns(
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
          8640,
          2160,
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
    return [
      this.sectionTitle(
        title.length ? title : DEFAULT_SECTION_TITLES.interests,
        HeadingLevel.HEADING_3
      ),
      new Table({
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
            children: createTwoDimArray(
              records.map((i) => i.name),
              3
            ).map(
              (column) =>
                new TableCell({
                  children: this.createBullets(column, 0, { before: 90 }),
                })
            ),
          }),
        ],
      }) as any,
    ];
  };
}
