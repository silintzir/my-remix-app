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
      fontSize: 11,
      alignment: "justify",
    },
    heading1: {
      fontSize: 18,
      bold: true,
      fontFeatures: ["smcp"],
      alignment: "center",
    },
    subheading1: {
      fontSize: 11,
      alignment: "center",
    },
    subheading2: {
      fontSize: 11,
      alignment: "center",
      italics: true,
    },
    heading2: {
      bold: true,
      alignment: "center",
      fontFeatures: ["smcp"],
      fontSize: 14,
    },
    heading3: {
      alignment: "center",
      fontSize: 13,
      fontFeatures: ["smcp"],
      bold: true,
    },
    heading4: {
      alignment: "center",
      fontSize: 12,
      italics: true,
      bold: true,
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
