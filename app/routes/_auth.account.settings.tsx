import { ChangePasswordForm } from "@/components/account/change-password-form";
import { UpdateProfileForm } from "@/components/account/update-profile-form";
import { useMe } from "@/components/hooks/useMe";
import type {
  ChangePasswordValues,
  Intent,
  UpdateProfileValues,
} from "@/lib/account/validation";
import { authenticatedFetch } from "@/lib/strapi.server";
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/lib/account/validation";
import { mdf } from "domain-functions";
import { getSession } from "@/sessions";
import { getToast, jsonWithSuccess } from "remix-toast";
import { useLoaderData } from "@remix-run/react";
import { useMyToast } from "@/components/hooks/useMyToast";

export async function action({ request }: ActionFunctionArgs) {
  const {
    data: { user },
  } = await getSession(request.headers.get("Cookie"));
  const body = Object.fromEntries(await request.formData()) as {
    _intent: Intent;
  };

  const validateProfile = mdf(updateProfileSchema)(async (values) => {
    await authenticatedFetch(request, `/api/users/${user?.id}`, {
      method: "PUT",
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
      }),
    });
    return "Profile successfully updated";
  });
  const validatePassword = mdf(changePasswordSchema)(async (values) => {
    const response = await authenticatedFetch(
      request,
      `/api/users/${user?.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          password: values.password,
        }),
      }
    );
    console.log(response);
    return "Password successfully updated";
  });

  const result =
    body._intent === "updateProfile"
      ? await validateProfile(body as UpdateProfileValues)
      : await validatePassword(body as ChangePasswordValues);

  if (result.success) {
    return jsonWithSuccess(null, result.data);
  }

  return result;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
}

export default function Account() {
  const me = useMe();
  useMyToast(useLoaderData<typeof loader>());

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-8 w-full">
      <UpdateProfileForm user={me} />
      <ChangePasswordForm />
    </div>
  );
}
