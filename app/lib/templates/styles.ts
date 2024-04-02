import { AlignmentType, type IStylesOptions } from "docx";
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
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
      fontSize: 13,
    },
    heading4: {
      fontSize: 11,
      italics: true,
    },
    headerRight: {
      lineHeight: 1.3,
      fontSize: 8,
      alignment: "right",
    },
    cellContent: {
      fontSize: 10,
      alignment: "left",
    },
    centered: {
      fontSize: 10,
      alignment: "center",
    },
  }),
};

export const docxStyles = {
  chicago: (_config: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 20,
          font: "serif",
        },
      },
      heading1: {
        run: {
          font: "serif",
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
          font: "serif",
          size: 24,
          bold: true,
        },
        paragraph: {
          spacing: {
            after: 200,
            before: 0,
          },
        },
      },
      heading4: {
        run: {
          font: "serif",
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
  accountant: (_config: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 20,
          font: "Arial",
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },

      heading1: {
        run: {
          size: 36,
          smallCaps: true,
          bold: true,
        },
        paragraph: {
          spacing: {
            before: 0,
            after: 0,
          },
          alignment: AlignmentType.LEFT,
        },
      },
      heading2: {
        run: {
          size: 30,
          smallCaps: true,
          bold: true,
        },
        paragraph: {
          spacing: {
            before: 250,
            after: 0,
          },
          alignment: "center",
        },
      },
      heading3: {
        run: {
          size: 28,
          smallCaps: true,
          bold: true,
        },
        paragraph: {
          spacing: {
            before: 250,
            after: 0,
          },
          alignment: "center",
        },
      },
      heading4: {
        run: {
          size: 22,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
        },
      },
      heading6: {
        run: {
          size: 16,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
          alignment: AlignmentType.RIGHT,
        },
      },
    },
  }),
};
