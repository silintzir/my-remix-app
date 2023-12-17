import { ChangePasswordForm } from "@/components/account/change-password-form";
import { UpdateProfileForm } from "@/components/account/update-profile-form";
import {
  updateProfileSchema,
  type Intent,
  changePasswordSchema,
  type UpdateProfileValues,
  type ChangePasswordValues,
} from "@/lib/account/validation";
import { authenticatedFetch } from "@/lib/strapi.server";
import { getSession } from "@/sessions";
import { type ActionFunctionArgs } from "@remix-run/node";
import { mdf } from "domain-functions";

export async function action({ request }: ActionFunctionArgs) {
  const body = Object.fromEntries(await request.formData()) as {
    _intent: Intent;
  };

  const {
    data: { user },
  } = await getSession(request.headers.get("Cookie"));

  const validateProfile = mdf(updateProfileSchema)(async (values) => {
    const response = await authenticatedFetch(
      request,
      `/api/users/${user?.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      }
    );
    console.log(response);
    return values;
  });
  const validatePassword = mdf(changePasswordSchema)(async (values) => values);

  const result =
    body._intent === "updateProfile"
      ? await validateProfile(body as UpdateProfileValues)
      : await validatePassword(body as ChangePasswordValues);

  if (result.success) {
    return null;
  }

  return result;
}

export default function AccountIndex() {
  return <div className="flex gap-8"></div>;
}
