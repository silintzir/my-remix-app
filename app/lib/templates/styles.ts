import type { IStylesOptions } from "docx";
import type { StyleDictionary } from "pdfmake/interfaces";

type StyleParams = {
  fontSize: number;
}

export const pdfStyles = {
  chicago: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize,
    },
    heading1: {
      fontSize: fontSize + 3,
      bold: true,
      alignment: "center",
      lineHeight: 1.2,
    },
    subheading1: {
      fontSize,
      alignment: "center",
      lineHeight: 1.2,
    },
    heading2: {
      bold: true,
      fontSize: fontSize + 2,
      lineHeight: 1.2,
    },
    heading3: {
      fontSize,
      decoration: "underline",
      lineHeight: 1.2,
      bold: true,
    },
    heading4: {
      fontSize,
      bold: true,
      italics: true,
    },
  })
}

export const docxStyles = {
  chicago: (_config: StyleParams): IStylesOptions => ({
    default: {
      heading1: {
        run: {
          size: 28,
          bold: true,
          color: '#000000',
        },
        paragraph: {
          spacing: {
            before: 0,
            after: 0
          }
        }
      },
      heading2: {
        run: {
          size: 26,
          bold: true,
          color: '#000000'
        },
        paragraph: {
          thematicBreak: true,
          spacing: {
            after: 0
          }
        }
      },
      heading3: {
        run: {
          size: 22,
          bold: true,
          color: '#000000'
        },
        paragraph: {
          spacing: {
            after: 0
          }
        }
      }
    }

  })
}
