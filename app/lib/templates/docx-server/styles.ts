import { AlignmentType, type IStylesOptions } from "docx";

type StyleParams = {
  fontSize: number;
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
            after: 0,
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
  executive: (_config: StyleParams): IStylesOptions => ({
    default: {
      document: {
        run: {
          size: 22,
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
          alignment: AlignmentType.CENTER,
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
          size: 24,
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
          size: 22,
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
          size: 22,
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
          size: 22,
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
            after: 40,
            before: 0,
          },
          alignment: AlignmentType.RIGHT,
        },
      },
    },
  }),
};
