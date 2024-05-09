import type { Content } from "pdfmake/interfaces";
import {
  TITLE,
  constr,
  nonEmptyAccomplishments,
  nonEmptyCertificates,
  nonEmptyEducation,
  nonEmptyInterests,
  nonEmptySkills,
  nonEmptyWork,
  skillDisplay,
  splitArrayByLimit,
} from "../helpers/common";
import { map, groupBy } from "lodash-es";
import { getReadableDateFromPicker } from "../../utils";
import { DEFAULT_SECTION_TITLES } from "../../defaults";
import { ContentProvider } from "../pdf.client";
import { ChicagoPdfTemplate } from "./ChicagoPdfTemplate";
import { getDoubleHLine } from "../helpers/pdf";
import { getRecordPeriod2 } from "@/lib/resume";

export class ExecutivePdfTemplate extends ChicagoPdfTemplate {
  summary = (): Content[] => {
    const {
      resume: {
        summary: { content, asObjective },
        skills,
      },
      meta: {
        steps: {
          summary: { title: summaryTitle, enabled: summaryEnabled },
          skills: { title: skillsTitle, enabled: skillsEnabled },
        },
      },
    } = this.values;
    const output: Content[] = [];
    let noSummary = false;
    if (!summaryEnabled || !content || !content.trim().length) {
      noSummary = true;
    } else {
      output.push({
        text: summaryTitle.length
          ? asObjective
            ? TITLE.OBJECTIVE
            : summaryTitle
          : DEFAULT_SECTION_TITLES.summary,
        style: "heading2",
      });
      output.push({ text: content, style: "paragraph", marginBottom: 12 });
    }

    const records = nonEmptySkills(skills);
    let noSkills = false;
    if (!skillsEnabled || !records.length) {
      noSkills = true;
    } else {
      output.push([
        {
          text: `–${
            skillsTitle.length ? skillsTitle : DEFAULT_SECTION_TITLES.skills
          }–`,
          style: "heading4",
        },
        splitArrayByLimit(map(records, skillDisplay), 78).map((row) => ({
          text: constr("  •  ", ...row),
          style: "paragraph",
          bold: true,
          italics: true,
          alignment: "center",
        })),
      ]);
    }
    if (noSummary && noSkills) {
      return [];
    }
    output.push(getDoubleHLine(0.7, 12, 12));
    return output;
  };
  work: ContentProvider = () => {
    const {
      resume: { work },
      meta: {
        steps: {
          work: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyWork(work);

    if (!enabled || !records.length) {
      return [];
    }

    // group by employer/location
    const p1 = map(records, (w) => ({
      ...w,
      period: getRecordPeriod2(w),
      group: constr(", ", w.name, constr(" ", w.city, w.state)),
    }));
    const p2 = groupBy(p1, "group");

    const stacks = [];
    for (const group in p2) {
      const stack = [];
      stacks.push({
        text: constr(
          ", ",
          p2[group][0].name,
          constr(", ", p2[group][0].city, p2[group][0].state)
        ),
        alignment: "center",
      } satisfies Content);

      for (const { position, period, bullets } of p2[group]) {
        stacks.push({
          text: [
            { text: position, bold: true },
            { text: " " },
            {
              // text: `(${constr(
              //   " - ",
              //   getReadableDateFromPicker(startDate),
              //   getReadableDateFromPicker(endDate)
              // )})`,
              text: period,
            },
          ],
          alignment: "center",
        });
        if (bullets && bullets.length) {
          stack.push({
            ul: bullets.map((b) => ({ text: b.content })),
            margin: [8, 0, 0, 0],
          } satisfies Content);
        }
      }

      stacks.push({
        stack,
        marginBottom: 8,
      });
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.work,
        style: "heading3",
      },
      {
        stack: stacks,
        style: "paragraph",
      } as Content,
    ];
  };
  education: ContentProvider = () => {
    const {
      resume: { education },
      meta: {
        steps: {
          education: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyEducation(education);

    if (!enabled || !records.length) {
      return [];
    }
    const output = [];

    for (const {
      institution,
      studyType,
      area,
      city,
      state,
      startDate,
      endDate,
      bullets,
    } of records) {
      output.push({
        text: constr(
          ", ",
          studyType,
          area,
          institution,
          city,
          state +
            ` (${constr(
              " - ",
              getReadableDateFromPicker(startDate),
              getReadableDateFromPicker(endDate)
            )})`
        ),
        alignment: "center",
      });
      if (bullets && bullets.length) {
        output.push({
          ul: bullets.map((b) => ({ text: b.content })),
          margin: [8, 0, 0, 8],
        } satisfies Content);
      }
    }
    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.education,
        style: "heading3",
      },
      {
        stack: output,
        style: "paragraph",
      } as Content,
    ];
  };
  skills: ContentProvider = () => [];
  certificates: ContentProvider = () => {
    const {
      resume: { certificates },
      meta: {
        steps: {
          certificates: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyCertificates(certificates);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.certificates,
        style: "heading3",
      },
      ...map(records, ({ name, issuer, date, url }) => {
        return {
          text: `${constr(
            " - ",
            name,
            issuer,
            url
          )} (${getReadableDateFromPicker(date)})`,
          style: "paragraph",
          alignment: "center",
          marginBottom: 8,
        } satisfies Content;
      }),
    ];
  };
  accomplishments: ContentProvider = () => {
    const {
      resume: { accomplishments },
      meta: {
        steps: {
          accomplishments: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyAccomplishments(accomplishments);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.accomplishments,
        style: "heading3",
      },
      {
        ul: map(records, (b) => b.name),
        style: "paragraph",
        margin: [8, 0, 0, 8],
      } satisfies Content,
    ];
  };
  interests = (): Content[] => {
    const {
      resume: { interests },
      meta: {
        steps: {
          interests: { title, enabled },
        },
      },
    } = this.values;

    const records = nonEmptyInterests(interests);

    if (!enabled || !records.length) {
      return [];
    }

    return [
      {
        text: title.length ? title : DEFAULT_SECTION_TITLES.interests,
        style: "heading3",
      },
      splitArrayByLimit(map(records, "name"), 85).map((row) => ({
        text: constr("  •  ", ...row),
        style: "paragraph",
        italics: true,
        alignment: "center",
      })),
    ];
  };
  basics = (): Content[] => {
    const {
      meta: { maskBasics },
      resume: {
        basics: {
          location: { address },
          firstName,
          lastName,
          email,
          phone,
          url,
        },
      },
    } = this.values;

    return [
      {
        text: constr(" ", firstName, lastName),
        style: "heading1",
      },
      {
        marginTop: 6,
        marginBottom: 12,
        table: {
          widths: ["*"],
          body: [
            [
              {
                columns: [
                  {
                    text: maskBasics ? TITLE.COMPANY_NAME : address,
                    style: "paragraph",
                    alignment: "left",
                    width: "45%",
                  },
                  { text: "", alignment: "center", width: "10%" },
                  {
                    text: maskBasics
                      ? TITLE.CONFIDENTIALITY_INFO_LBR
                      : constr("\n", phone, email, url),
                    style: "paragraph",
                    alignment: "right",
                    width: "45%",
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 4,
          hLineWidth: (i) => (i === 1 ? 1 : 0),
          vLineWidth: () => 0,
        },
      },
    ];
  };
}
