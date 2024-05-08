import { AlignmentType, type IStylesOptions } from "docx";

type StyleParams = {
  fontSize: number;
};

export const docxStyles = {
  chicago: ({ fontSize }: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          font: "Arial",
          size: 2.0 * fontSize,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      heading1: {
        run: {
          font: "Arial",
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
          font: "Arial",
          size: 2.6 * fontSize,
          allCaps: true,
          bold: true,
        },
        paragraph: {
          spacing: { before: 200, after: 0 },
        },
      },
      heading3: {
        run: {
          font: "Arial",
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
          font: "Arial",
          size: 2.2 * fontSize,
        },
        paragraph: {
          spacing: {
            after: 0,
            before: 0,
          },
        },
      },
      heading5: {
        run: {
          font: "Arial",
          size: 1.0 * fontSize,
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
          font: "Arial",
          size: 2.0 * fontSize,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
    },
  }),
  executive: ({ fontSize }: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          font: "Arial",
          size: 2.2 * fontSize,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      heading1: {
        run: {
          font: "Arial",
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
          font: "Arial",
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
          font: "Arial",
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
          font: "Arial",
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
          font: "Arial",
          size: 1.1 * fontSize,
        },
      },
      heading6: {
        run: {
          font: "Arial",
          size: 2.2 * fontSize,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      title: {
        run: {
          font: "Arial",
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
          font: "Arial",
          size: 2.0 * fontSize,
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      heading1: {
        run: {
          font: "Arial",
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
          font: "arial",
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
          font: "arial",
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
          font: "arial",
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
          font: "arial",
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
