import {
  BorderStyle,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableRow,
} from "docx";

export const getDoubleHLine = (marginTop = 0, marginBottom = 0) =>
  new Table({
    columnWidths: [10800],
    margins: {
      left: 0,
      top: marginTop,
      bottom: marginBottom,
    },
    borders: {
      insideHorizontal: {
        style: BorderStyle.NONE,
      },
      bottom: {
        size: 1,
        style: BorderStyle.DOUBLE,
      },
      left: {
        size: 0,
        style: BorderStyle.NONE,
      },
      top: {
        style: BorderStyle.NONE,
      },
      right: {
        style: BorderStyle.NONE,
      },
      insideVertical: {
        style: BorderStyle.NONE,
      },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ style: HeadingLevel.HEADING_6 })],
          }),
        ],
      }),
    ],
  });
