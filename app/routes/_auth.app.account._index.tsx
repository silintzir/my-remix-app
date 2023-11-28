import { PasswordForm } from "@/components/account/change-password-form";
import { ProfileForm } from "@/components/account/profile-form";

export default function AccountIndex() {
  return (
    <div className="flex gap-8">
      <ProfileForm />
      <PasswordForm />
    </div>
  );
}
