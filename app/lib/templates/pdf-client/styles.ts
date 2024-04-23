import type { StyleDictionary } from "pdfmake/interfaces";

type StyleParams = {
  fontSize: number;
};

export const pdfStyles = {
  chicago: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize,
      alignment: "justify",
    },
    heading1: {
      fontSize: 1.8 * fontSize,
      bold: true,
      alignment: "center",
    },
    subheading1: {
      fontSize: 1.1 * fontSize,
      alignment: "center",
    },
    subheading2: {
      // Section title
      fontSize: 1.1 * fontSize,
      alignment: "center",
      italics: true,
    },
    heading2: {
      // Company name
      bold: true,
      fontSize: 1.3 * fontSize,
    },
    heading3: {
      // Job title and period
      fontSize: 1.2 * fontSize,
      bold: true,
      marginBottom: 20,
    },
    heading4: {
      fontSize: 1.1 * fontSize,
      italics: true,
    },
  }),
  executive: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize: 1.1 * fontSize,
      alignment: "justify",
    },
    heading1: {
      fontSize: 1.8 * fontSize,
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
    },
    subheading1: {
      fontSize: 1.1 * fontSize,
      alignment: "center",
    },
    subheading2: {
      fontSize: 1.1 * fontSize,
      alignment: "center",
      italics: true,
    },
    heading2: {
      bold: true,
      alignment: "center",
      fontFeatures: ["smcp"],
      fontSize: 1.4 * fontSize,
    },
    heading3: {
      alignment: "center",
      fontSize: 1.3 * fontSize,
      fontFeatures: ["smcp"],
      bold: true,
    },
    heading4: {
      alignment: "center",
      fontSize: 1.2 * fontSize,
      italics: true,
      bold: true,
    },
  }),
  accountant: ({ fontSize }: StyleParams): StyleDictionary => ({
    paragraph: {
      fontSize,
      alignment: "justify",
    },
    heading1: {
      fontSize: 1.6 * fontSize,
      fontFeatures: ["smcp"],
      bold: true,
      alignment: "left",
    },
    subheading1: {
      fontSize: 1.1 * fontSize,
      alignment: "center",
    },
    subheading2: {
      // Section title
      fontSize: 1.1 * fontSize,
      alignment: "center",
      italics: true,
    },
    heading2: {
      // Summary title
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
      fontSize: 1.4 * fontSize,
    },
    heading3: {
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
      fontSize: 1.3 * fontSize,
    },
    heading4: {
      fontSize: 1.1 * fontSize,
      italics: true,
    },
    headerRight: {
      lineHeight: 1.3,
      fontSize: 0.8 * fontSize,
      alignment: "right",
    },
    cellContent: {
      fontSize,
      alignment: "left",
    },
    centered: {
      fontSize,
      alignment: "center",
    },
  }),
};
