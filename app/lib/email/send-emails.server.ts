import { render } from "@react-email/render";
import { ContactEmail } from "./templates/ContactTemplate";
import { ResumeAttachmentEmail } from "./templates/ResumeAttachmentTemplate";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import aws from "@aws-sdk/client-ses";
import type { ContactData } from "@/components/website/types";

const { SES } = aws;

const ses = new SES({
  region: process.env.AWS_SES_REGION,
  apiVersion: "2010-12-01",
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY || "",
    secretAccessKey: process.env.AWS_SES_SECRET || "",
  },
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export const sendEmail = async (data: ContactData) => {
  const emailHtml = render(ContactEmail(data));

  const params = {
    Source: process.env.AWS_SES_FROM,
    Destination: {
      ToAddresses: ["psilintziris@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailHtml,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "ResumeRunner contact",
      },
    },
  };
  await ses.sendEmail(params);
};

export const sendAttachment = async (
  name: string,
  email: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any
) => {
  const mailOptions: Mail.Options = {
    from: process.env.AWS_SES_FROM,
    to: ["psilintziris@gmail.com", email],
    subject: "Your resume by ResumeRunner",
    text: "Please find your resume attached as a .doc file",
    html: render(ResumeAttachmentEmail({ name })),
    attachments: [
      {
        filename: "resume.doc",
        content: data,
        encoding: "base64",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
