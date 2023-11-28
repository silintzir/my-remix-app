import type { ContactData } from "@/components/website/types";
import { sendEmail } from "@/lib/email/send-emails.server";
import { json, type ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const body = (await request.json()) as ContactData;
  await sendEmail(body);
  return json({ response: { success: true } });
}
