import type { Content } from "pdfmake/interfaces";

export function getHeaderWithLine(text: string): Content {
  return {
    marginTop: 6,
    marginBottom: 6,
    table: {
      widths: ["*"],
      body: [
        [
          {
            text: text.toUpperCase(),
            style: "heading2",
          },
        ],
      ],
    },
    layout: {
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => -2,
      hLineWidth: (i) => (i === 1 ? 1 : 0),
      vLineWidth: () => 0,
    },
  };
}

export function get2ColsSpaceBetween(
  left: Content,
  right: Content,
  marginBottom = 0,
  width = "65%"
) {
  return [
    {
      alignment: "justify",
      columns: [
        { text: left, alignment: "left", width },
        { text: right, alignment: "right" },
      ],
      marginBottom,
    },
  ] satisfies Content;
}

export function pine(arr: Content[], text: string, style: string) {
  if (!text.trim().length) {
    return;
  }
  arr.push({
    text,
    style,
  });
}

export const getDoubleHLine = (
  distance: number,
  marginTop: number,
  marginBottom: number
) => [
  {
    marginTop,
    marginBottom,
    table: {
      widths: ["*"],
      body: [[{ columns: [{ text: "" }, { text: "" }] }]],
    },
    layout: {
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => distance,
      hLineWidth: () => 1,
      vLineWidth: () => 0,
    },
  },
];
