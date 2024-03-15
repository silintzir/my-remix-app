import type {
  Content,
  LineStyle,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import type { ResumeValues, Step, Template } from "@/lib/types";
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
      pine(output, "Marathon Staffing", "subheading1");
      pine(
        output,
        "Confidential document, not for distribution without prior permission.",
        "subheading2"
      );
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
            ? "Objective"
            : title
          : DEFAULT_SECTION_TITLES.summary
      )
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
      stack.push(
        get2ColsSpaceBetween(
          {
            text: p2[group][0].institution,
            style: "heading3",
            alignment: "left",
          },
          {
            text: constr(", ", p2[group][0].city, p2[group][0].state),
            style: "heading3",
            alignment: "right",
          },
          10
        )
      );

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
      stack.push(
        get2ColsSpaceBetween(
          {
            text: p2[group][0].name,
            style: "heading3",
            alignment: "left",
          },
          {
            text: constr(", ", p2[group][0].city, p2[group][0].state),
            style: "heading3",
            alignment: "right",
          },
          2
        )
      );

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

class ExecutivePdfTemplate extends ChicagoPdfTemplate {
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

class AccountantPdfTemplate extends ChicagoPdfTemplate {
  summary = (): Content[] => {
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
            ? "Objective"
            : "Summary"
          : DEFAULT_SECTION_TITLES.summary,
        style: "heading2",
      });
      output.push({ text: content, style: "paragraph", marginBottom: 12 });
    }

    const records = nonEmptySkills(skills);

    let noSkills = false;
    if (!skillsEnabled || !records.length) {
      noSkills = true;
    }

    output.push({
      text: constr(", ", ...map(records, skillDisplay)),
      style: "paragraph",
      marginBottom: 12,
    });
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
        marginTop: 6,
        marginBottom: 12,
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
                    width: "60%",
                  },
                  {
                    text: `\n${address}\n${constr(" | ", phone, email, url)}`,
                    style: "headerRight",
                    width: "40%",
                  },
                ],
              },
            ],
            [
              {
                columns: [
                  {
                    text: "",
                  },
                  {
                    text: "",
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
          paddingBottom: (i) => (i >= 1 ? 0.7 : 4),
          hLineWidth: (i) => (i >= 1 ? 1 : 0),
          vLineWidth: () => 0,
        },
      },
    ];
  };
}

type DefConf = {
  isSample?: boolean;
  fontSize?: number;
  template?: Template;
};

export default function getDefinition(
  data: ResumeValues,
  { isSample = false, fontSize = 11, template = "chicago" }: DefConf
): TDocumentDefinitions {
  const styles =
    template === "chicago"
      ? pdfStyles.chicago({ fontSize })
      : template === "accountant"
      ? pdfStyles.accountant({ fontSize })
      : pdfStyles.executive({ fontSize });
  let struct: any;
  switch (template) {
    case "executive":
      struct = new ExecutivePdfTemplate(data);
      break;
    case "accountant":
      struct = new AccountantPdfTemplate(data);
      break;
    default:
      struct = new ChicagoPdfTemplate(data);
  }

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
