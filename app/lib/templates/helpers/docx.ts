import {
  BorderStyle,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { ChicagoDocxTemplate } from "../docx-server/ChicagoDocxTemplate";

export const addBottomDoubleHLine = (
  content: Paragraph[],
  marginTop = 0,
  marginBottom = 0
) =>
  new Table({
    columnWidths: [ChicagoDocxTemplate.TOTAL_TABLE_WIDTH],
    margins: {
      left: 0,
      top: marginTop,
      bottom: marginBottom,
    },
    borders: {
      bottom: {
        style: BorderStyle.NONE,
      },
      left: {
        style: BorderStyle.NONE,
      },
      top: {
        style: BorderStyle.NONE,
      },
      right: {
        style: BorderStyle.NONE,
      },
    },
    indent: {
      size: 60,
      type: WidthType.DXA,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: ChicagoDocxTemplate.TOTAL_TABLE_WIDTH,
              type: WidthType.DXA,
            },
            margins: { bottom: 120 },
            borders: {
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
            },
            children: content,
          }),
        ],
      }),
    ],
  });
