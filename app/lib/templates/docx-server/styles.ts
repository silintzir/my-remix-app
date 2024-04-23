import { AlignmentType, type IStylesOptions } from "docx";

type StyleParams = {
  fontSize: number;
};

export const docxStyles = {
  chicago: ({ fontSize }: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 2.0 * fontSize,
          font: "serif",
        },
      },
      heading1: {
        run: {
          font: "serif",
          size: 3.6 * fontSize,
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
          size: 2.6 * fontSize,
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
          size: 2.4 * fontSize,
          bold: true,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
        },
      },
      heading4: {
        run: {
          font: "serif",
          size: 2.2 * fontSize,
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
  executive: ({ fontSize }: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 2.2 * fontSize,
          font: "Arial",
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      heading1: {
        run: {
          size: 3.6 * fontSize,
          smallCaps: true,
          bold: true,
        },
        paragraph: {
          spacing: {
            before: 0,
            after: 0,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      heading2: {
        run: {
          size: 3.0 * fontSize,
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
          size: 2.8 * fontSize,
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
          size: 2.4 * fontSize,
          bold: true,
          italics: true,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      heading5: {
        run: {
          size: 2.2 * fontSize,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 200,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      heading6: {
        run: {
          size: 2.2 * fontSize,
          bold: true,
          italics: true,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      title: {
        run: {
          size: 2.2 * fontSize,
          italics: true,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
          alignment: AlignmentType.CENTER,
        },
      },
    },
  }),
  accountant: ({ fontSize }: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 2.0 * fontSize,
          font: "Arial",
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      heading1: {
        run: {
          size: 3.6 * fontSize,
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
          size: 3.0 * fontSize,
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
          size: 2.8 * fontSize,
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
          size: 2.2 * fontSize,
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
          size: 1.6 * fontSize,
        },
        paragraph: {
          spacing: {
            after: 40,
            before: 0,
          },
          alignment: AlignmentType.RIGHT,
        },
      },
    },
  }),
};
