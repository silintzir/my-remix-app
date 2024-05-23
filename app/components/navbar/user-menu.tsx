import { Link, useSubmit } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  CircleUserRound,
  GaugeCircle,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import type { StrapiUser } from "@/lib/types";
import { DASHBOARD } from "@/lib/routes";
import { useTranslation } from "react-i18next";

interface Props {
  user: StrapiUser;
}

function getInitials(firstName: string | null, lastName: string | null) {
  if (firstName && lastName) {
    // Both firstName and lastName are not null
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }
  if (firstName) {
    // Only firstName is not null
    return firstName.substring(0, 2).toUpperCase();
  }
  if (lastName) {
    // Only lastName is not null
    return lastName.substring(0, 2).toUpperCase();
  }
  // Both are null or empty
  return "RR";
}

export function UserMenu({ user }: Props) {
  const submit = useSubmit();

  const logout = () => {
    submit(null, { method: "POST", action: "/logout" });
  };
  const { t } = useTranslation();

  return (
    <div id="user-menu">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="hover:border-primary hover:border-2">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-primary flex items-center">
            <CircleUserRound className="w-4 h-4 mr-2" />
            <span>{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={DASHBOARD}>
                <GaugeCircle />
                <span>{t("base.dashboard")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/account/settings">
                <Settings />
                <span>{t("account.account_settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={logout} className="flex">
                <LogOut />
                <span>{t("account.logout")}</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
