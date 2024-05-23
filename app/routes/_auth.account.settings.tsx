import { ChangePasswordForm } from "@/components/account/change-password-form";
import { UpdateProfileForm } from "@/components/account/update-profile-form";
import { useMe } from "@/components/hooks/useMe";
import type {
  ChangePasswordValues,
  DeleteAccountValues,
  Intent,
  UpdateProfileValues,
} from "@/lib/account/validation";
import { authenticatedFetch } from "@/lib/strapi.server";
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import {
  CHANGE_PASSWORD_INTENT,
  UPDATE_PROFILE_INTENT,
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "@/lib/account/validation";
import { mdf } from "domain-functions";
import { destroySession, getSession } from "@/sessions";
import { getToast, jsonWithSuccess } from "remix-toast";
import { useLoaderData } from "@remix-run/react";
import { useMyToast } from "@/components/hooks/useMyToast";
import { DeleteAccountForm } from "@/components/account/delete-account";

export const meta: MetaFunction = () => {
  return [{ title: "Account :: Settings" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = Object.fromEntries(await request.formData()) as {
    _intent: Intent;
  };

  console.log(body);

  const {
    data: { user },
  } = session;

  const validateProfile = mdf(updateProfileSchema)(async (values) => {
    console.log(values);
    const response = await authenticatedFetch(
      request,
      `/api/users/${user?.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          language: values.language,
        }),
      }
    );
    console.log(response);
    return "Profile successfully updated";
  });
  const validatePassword = mdf(changePasswordSchema)(async (values) => {
    const response = await authenticatedFetch(
      request,
      `/api/users/${user?.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          provider: "local",
          password: values.password,
        }),
      }
    );
    console.log(response);
    return "Password successfully updated";
  });
  const validateDelete = mdf(deleteAccountSchema)(async (_values) => {
    await authenticatedFetch(request, `/api/users/${user?.id}`, {
      method: "DELETE",
    });
  });

  const result =
    body._intent === UPDATE_PROFILE_INTENT
      ? await validateProfile(body as UpdateProfileValues)
      : body._intent === CHANGE_PASSWORD_INTENT
      ? await validatePassword(body as ChangePasswordValues)
      : await validateDelete(body as DeleteAccountValues);

  if (result.success) {
    if (body._intent === "deleteAccount") {
      return redirect("/", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }

    return jsonWithSuccess(null, result.data as string);
  }

  return result;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
}

export default function Account() {
  const me = useMe();
  useMyToast(useLoaderData<typeof loader>() as any);

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-8 w-full">
      <UpdateProfileForm user={me} />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
