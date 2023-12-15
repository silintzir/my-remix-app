import { Content } from "pdfmake/interfaces";

export function constr(delimiter: string, ...strings: string[]): string {
  return strings.filter((str) => str !== "").join(delimiter);
}

export function getHeaderWithLine(text: string): Content {
  return {
    marginTop: 8,
    marginBottom: 4,
    table: {
      widths: ["*"],
      body: [
        [
          {
            text,
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

export function get2ColsSpaceBetween(left: Content, right: Content) {
  return [
    {
      alignment: "justify",
      columns: [left, { text: right, alignment: "right" }],
      marginTop: 2,
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
