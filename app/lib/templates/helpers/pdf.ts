import type { Content } from "pdfmake/interfaces";

export function getHeaderWithLine(text: string): Content {
  return {
    marginTop: 12,
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

export function get2ColsSpaceBetween(left: Content, right: Content, mb = 0) {
  return [
    {
      alignment: "justify",
      columns: [
        { text: left, alignment: "left", width: "65%" },
        { text: right, alignment: "right" },
      ],
      marginBottom: mb,
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
