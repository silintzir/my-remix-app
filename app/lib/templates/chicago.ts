import type { Content } from "pdfmake/interfaces";
import type { ResumeValues } from "../types";

export class ResumeTemplate {
  public data: ResumeValues;
  constructor(data: ResumeValues) {
    this.data = data;
  }

  getFullName() {
    const {
      basics: { firstName, lastName },
    } = this.data.resume;
    const toks = [];
    if (firstName.trim().length) {
      toks.push(firstName);
    }
    if (lastName.trim().length) {
      toks.push(lastName);
    }
    return toks.join(" ");
  }

  getContactInfo() {
    const {
      basics: { phone, email, social },
    } = this.data.resume;
    const toks = [];
    if (phone.trim().length) {
      toks.push(phone);
    }
    if (email.trim().length) {
      toks.push(email);
    }
    if (social.trim().length) {
      toks.push(social);
    }
    return toks.join(" | ");
  }

  getAddress() {
    return this.data.resume.basics.address;
  }

  getHeaderWithLine(text: string): Content {
    return {
      marginTop: 8,
      table: {
        widths: ["*"],
        body: [
          [
            {
              text,
              fontSize: 14,
              bold: true,
            },
          ],
        ],
      },
      layout: {
        paddingLeft: () => 0,
        paddingRight: () => 0,
        hLineWidth: (i) => (i === 1 ? 1 : 0),
        vLineWidth: () => 0,
      },
    };
  }
}
