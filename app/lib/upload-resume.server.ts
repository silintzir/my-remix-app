import { type UploadHandler, json } from "@remix-run/node";
import { v4 } from "uuid";
import {
  S3,
  GetObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { defaultResumeValues } from "@/lib/defaults";
import { get, map, set, zipObject, trim, filter } from "lodash-es";
import type {
  BasicsValues,
  CertificateRecord,
  EducationRecord,
  InterestRecord,
  SkillRecord,
  SummaryValues,
  WorkRecord,
} from "@/lib/types";
import { usStateCodes, usStates } from "@/lib/states";

const statesMap = zipObject(usStates, usStateCodes);

function transformFullDate(date: string) {
  const toks = date.split("-");
  return toks[1] + "/" + toks[0];
}

const s3 = new S3({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET as string,
  },
});

const uploadStreamToS3 = async (
  data: AsyncIterable<Uint8Array>,
  key: string,
  contentType: string
) => {
  const BUCKET_NAME = "resumerunner.ai";

  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: await convertToBuffer(data),
    ContentType: contentType,
  };

  await s3.send(new PutObjectCommand(params));

  let url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 15 * 60 }
  );

  // return key;
  //

  return url;
};

// The UploadHandler gives us an AsyncIterable<Uint8Array>, so we need to convert that to something the aws-sdk can use.
// Here, we are going to convert that to a buffer to be consumed by the aws-sdk.
async function convertToBuffer(a: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of a) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}

const accepted = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
  "text/plain",
  "application/rtf",
  "text/html",
  "image/png",
  "image/jpeg",
];

export const s3UploadHandler: UploadHandler = async ({
  filename,
  data,
  contentType,
}) => {
  if (accepted.includes(contentType) === false)
    throw new Error("Invalid file type");

  return await uploadStreamToS3(data, filename!, contentType);
};

export async function parseFile(fileUrl: string) {
  try {
    const options = {
      method: "POST",
      url: "https://api.edenai.run/v2/ocr/resume_parser",
      headers: {
        Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
      },
      data: {
        providers: "hireability",
        file_url: fileUrl,
        fallback_providers: "affinda",
      },
    };

    const response = await axios.request(options);

    const output = defaultResumeValues(
      {
        firstName: "",
        lastName: "",
        email: "",
      },
      "en"
    );

    const extracted = get(response, "data.eden-ai.extracted_data", {});
    const personal = get(extracted, "personal_infos");
    const education = get(extracted, "education.entries", []) || [];
    const experience = get(extracted, "work_experience.entries", []) || [];
    const skills = get(extracted, "skills", []) || [];
    const certificates = get(extracted, "certifications", []) || [];
    const interests = get(extracted, "interests", []) || [];

    set(output, "resume.basics", {
      firstName: get(personal, "name.first_name", "") || "",
      lastName: get(personal, "name.last_name", "") || "",
      email: get(personal, "mails.0", "") || "",
      phone: get(personal, "phones.0", "") || "",
      location: {
        address: get(personal, "address.raw_input_location", "") || "",
      },
      url: get(personal, "urls.0", ""),
    } satisfies BasicsValues);

    // self summary
    set(output, "resume.summary", {
      asObjective: false,
      content: get(personal, "self_summary", "") || "",
    } satisfies SummaryValues);
    if (output.resume.summary.content.length) {
      set(output, "meta.steps.summary.enabled", true);
    }

    set(
      output,
      "resume.education",
      map(education, (e) => {
        const sd = get(e, "start_date") || "";
        const ed = get(e, "end_date") || "";
        const re = get(e, "location.region") || "";
        const ti = get(e, "title", "") || "";
        const ac = get(e, "accreditation", "") || "";
        const de = get(e, "description", "") || "";
        const toks = map(
          filter(de.split("."), (b) => trim(b).length > 0),
          (b) => trim(b.replaceAll("*", ""))
        );
        return {
          uuid: v4(),
          institution: get(e, "establishment", "") || "",
          studyType: ti.length ? ac : "",
          area: ti.length ? ti : ac,
          startDate: sd ? transformFullDate(sd) : "",
          endDate: ed ? transformFullDate(ed) : "",
          city: get(e, "location.city", "") || "",
          state: re && statesMap[re] ? statesMap[re] : re,
          status: ed ? "graduated" : "ongoing",
          bullets: map(toks, (b) => {
            return { uuid: v4(), content: b };
          }),
        } satisfies EducationRecord;
      })
    );

    set(
      output,
      "resume.work",
      map(experience, (e) => {
        const sd = get(e, "start_date") || "";
        const ed = get(e, "end_date") || "";
        const re = get(e, "location.region") || "";
        const de = get(e, "description", "") || "";
        const toks = map(
          filter(de.split("."), (b) => trim(b).length > 0),
          (b) => trim(b.replaceAll("*", ""))
        );

        return {
          uuid: v4(),
          name: get(e, "company", "") || "",
          startDate: sd ? transformFullDate(sd) : "",
          endDate: ed ? transformFullDate(ed) : "",
          position: get(e, "title", "") || "",
          city: get(e, "location.city", "") || "",
          state: re && statesMap[re] ? statesMap[re] : re,
          bullets: map(toks, (b) => {
            return { uuid: v4(), content: b };
          }),
        } satisfies WorkRecord;
      })
    );

    set(
      output,
      "resume.skills",
      map(skills, (s) => {
        return {
          uuid: v4(),
          name: get(s, "name", "") || "",
          level: "no_mention",
        } satisfies SkillRecord;
      })
    );

    set(
      output,
      "resume.interests",
      map(interests, (s) => {
        return {
          uuid: v4(),
          name: get(s, "name", "") || "",
        } satisfies InterestRecord;
      })
    );

    set(
      output,
      "resume.certificates",
      map(certificates, (s) => {
        return {
          uuid: v4(),
          name: get(s, "name", "") || "",
          issuer: "",
          date: "",
          url: "",
        } satisfies CertificateRecord;
      })
    );
    if (output.resume.certificates.length) {
      set(output, "meta.steps.certificates.enabled", true);
    }

    return output;
  } catch (e: unknown) {
    return json({
      error: "Failed to import resume",
    });
  }
}
