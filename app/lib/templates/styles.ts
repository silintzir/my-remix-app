import type { IStylesOptions } from "docx";
import type { StyleDictionary } from "pdfmake/interfaces";

type StyleParams = {
  fontSize: number;
};

export const pdfStyles = {
  chicago: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize: 10,
    },
    heading1: {
      fontSize: 18,
      bold: true,
      alignment: "center",
    },
    subheading1: {
      fontSize: 11,
      alignment: "center",
    },
    subheading2: {
      // Section title
      fontSize: 11,
      alignment: "center",
      italics: true,
    },
    heading2: {
      // Company name
      bold: true,
      fontSize: 13,
    },
    heading3: {
      // Job title and period
      fontSize: 12,
      bold: true,
      marginBottom: 20,
    },
    heading4: {
      fontSize: 11,
      italics: true,
    },
  }),
  executive: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize: 10,
      alignment: "center",
    },
    heading1: {
      fontSize: 18,
      bold: true,
      alignment: "center",
    },
    subheading1: {
      fontSize: 11,
      alignment: "center",
    },
    subheading2: {
      // Section title
      fontSize: 11,
      alignment: "center",
      italics: true,
    },
    heading2: {
      // Company name
      bold: true,
      alignment: "center",
      fontSize: 13,
    },
    heading3: {
      // Job title and period
      fontSize: 12,
      bold: true,
    },
    heading4: {
      fontSize: 11,
      italics: true,
    },
  }),
  accountant: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize: 10,
      alignment: "justify",
    },
    heading1: {
      fontSize: 16,
      fontFeatures: ["smcp"],
      bold: true,
      alignment: "left",
    },
    subheading1: {
      fontSize: 11,
      alignment: "center",
    },
    subheading2: {
      // Section title
      fontSize: 11,
      alignment: "center",
      italics: true,
    },
    heading2: {
      // Summary title
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
      fontSize: 14,
    },
    heading3: {
      // Job title and period
      fontSize: 12,
      bold: true,
    },
    heading4: {
      fontSize: 11,
      italics: true,
    },
    headerRight: {
      fontSize: 9,
      alignment: "right",
    },
  }),
};

export const docxStyles = {
  chicago: (_config: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: "10pt",
          font: "serif",
        },
      },
      heading1: {
        run: {
          font: {
            name: "serif",
          },
          size: 36,
          bold: true,
          color: "#000000",
        },
        paragraph: {
          spacing: {
            before: 0,
            after: 0,
          },
        },
      },
      heading2: {
        run: {
          size: 26,
          allCaps: true,
          font: "serif",
          bold: true,
        },
        paragraph: {
          thematicBreak: true,
          spacing: {
            after: 0,
          },
        },
      },
      heading3: {
        run: {
          font: {
            name: "serif",
          },
          size: 24,
          bold: true,
        },
        paragraph: {
          spacing: {
            after: 150,
            before: 0,
          },
        },
      },
      heading4: {
        run: {
          font: {
            name: "serif",
          },
          size: 22,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
        },
      },
    },
  }),
};
