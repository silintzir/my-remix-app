import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import type { ResumeValues, Step } from "@/lib/types";
import { constr, get2ColsSpaceBetween, getHeaderWithLine, pine } from "@/lib/templates/pdf-helpers";
import { map, groupBy } from "lodash-es";

interface ContentProvider {
  (): Content[];
}

abstract class Styler {
  public config;
  constructor(config: { fontSize: number }) {
    this.config = config;
  }

  abstract getStyles(): StyleDictionary;
}

class DefaultStyler extends Styler {
  getStyles(): StyleDictionary {
    return {
      paragraph: {
        fontSize: 11,
      },
      heading1: {
        fontSize: 14,
        bold: true,
        alignment: "center",
        lineHeight: 1.2,
      },
      subheading1: {
        fontSize: 10,
        alignment: "center",
        lineHeight: 1.2,
      },
      heading2: {
        bold: true,
        fontSize: 13,
        lineHeight: 1.2,
      },
      heading3: {
        fontSize: 11,
        decoration: "underline",
        lineHeight: 1.2,
        bold: true,
      },
      heading4: {
        fontSize: 11,
        bold: true,
        italics: true,
      },
    };
  }
}

abstract class Structurer {
  public values: ResumeValues;
  public constructor(values: ResumeValues) {
    this.values = values;
  }

  abstract create(): Content[];
}

class DefaultStructurer extends Structurer {
  basics = (): Content[] => {
    const {
      resume: { basics: { location: { address }, firstName, lastName, email, phone, url } },
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
      meta: { steps: { accomplishments: { title } } },
    } = this.values;
    if (!accomplishments.length) {
      return [];
    }

    return [
      getHeaderWithLine(title),
      { ul: map(accomplishments, (a) => a.name), style: "paragraph" },
    ];
  };

  interests = (): Content[] => {
    const {
      resume: { interests },
      meta: { steps: { interests: { title } } },
    } = this.values;

    if (!interests.length) {
      return [];
    }

    return [
      getHeaderWithLine(title),
      { text: constr(", ", ...map(interests, (i) => i.name)), style: "paragraph" },
    ];
  };

  skills: ContentProvider = () => {
    const {
      resume: { skills },
      meta: { steps: { skills: { title } } },
    } = this.values;

    if (!skills.length) {
      return [];
    }
    return [
      getHeaderWithLine(title),
      { ul: map(skills, (s) => `${s.name} (${s.level})`), style: "paragraph" },
    ];
  };

  certificates: ContentProvider = () => {
    const {
      resume: { certificates },
      meta: { steps: { certificates: { title } } },
    } = this.values;

    if (!certificates.length) {
      return [];
    }

    return [
      getHeaderWithLine(title),
      {
        ul: map(certificates, (s) => {
          const firstLine = [];
          if (s.name.trim().length) {
            firstLine.push(s.name);
          }
          if (s.date.trim().length) {
            firstLine.push(`[${s.date}]`);
          }
          const secondLine = constr(" - ", s.issuer, s.url);
          return constr("\n", firstLine.join(" "), secondLine);
        }),
        style: "paragraph",
      },
    ];
  };

  summary = (): Content[] => {
    const {
      resume: { summary: { content } },
      meta: { steps: { summary: { title } } },
    } = this.values;
    const output: Content[] = [];

    if (!content.trim().length) {
      return output;
    }

    output.push(getHeaderWithLine(title));
    output.push({ text: content, style: "paragraph" });

    return output;
  };

  education: ContentProvider = () => {
    const {
      resume: { education },
      meta: { steps: { education: { title } } },
    } = this.values;

    if (!education.length) {
      return [];
    }

    // group by employer/location
    const p1 = map(education, (w) => ({
      ...w,
      group: constr(", ", w.institution, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stack.push({ text: group, style: "heading3" });

      for (const { area, studyType, startDate, endDate, bullets } of p2[group]) {
        stack.push(
          get2ColsSpaceBetween(
            { text: constr(", ", area, studyType), style: "heading4", alignment: 'left' },
            { text: constr(" - ", startDate, endDate), italics: true, fontSize: 11 },
          ),
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
      getHeaderWithLine(title),
      {
        stack: stacks,
        style: "paragraph",
      },
    ];
  };

  work: ContentProvider = () => {
    const {
      resume: { work },
      meta: { steps: { work: { title } } },
    } = this.values;

    if (!work.length) {
      return [];
    }

    // group by employer/location
    const p1 = map(work, (w) => ({
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
            { text: position, style: "heading4", alignment: 'left' },
            { text: constr(" - ", startDate, endDate), italics: true, fontSize: 11 },
          ),
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
      getHeaderWithLine(title),
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
};

export default function getDefinition(
  data: ResumeValues,
  { isSample }: DefConf = { isSample: false },
): TDocumentDefinitions {
  const styler = new DefaultStyler({ fontSize: 10 });
  const struct = new DefaultStructurer(data);

  return {
    styles: styler.getStyles(),
    pageSize: "LETTER",
    ...(isSample
      ? {
        watermark: { text: "Sample resume", fontSize: 60 },
      }
      : {}),
    header: {
      marginTop: 2,
      columns: [
        {
          text: new Date().toUTCString(),
          alignment: "left",
          marginLeft: 8,
          fontSize: 8,
        },
        {
          text: "https://resumerunner.ai",
          link: "https://resumerunner.ai",
          alignment: "right",
          fontSize: 8,
          marginRight: 8,
        },
      ],
    },
    footer: (currentPage, pageCount) => ({
      text: `${currentPage.toString()} of ${pageCount.toString()}`,
      alignment: "center",
    }),
    content: struct.create(),
  };
}
