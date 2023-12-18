import { Form, useNavigate, useSubmit } from "@remix-run/react";
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
import { CircleUserRound, GaugeCircle, HelpCircle, LogOut } from "lucide-react";
import { useRef } from "react";
import type { StrapiUser } from "@/lib/types";

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
  const navigate = useNavigate();

  const ref = useRef<HTMLFormElement>(null);

  const logout = () => {
    submit(ref.current);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:border-primary hover:border-2 h-10 w-10 bg-muted-foreground">
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/account/dashboard")}>
            <GaugeCircle className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/account/settings")}>
            <CircleUserRound className="w-4 h-4 mr-2" />
            <span>Account settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="w-4 h-4 mr-2" />
            <span>FAQ</span>
          </DropdownMenuItem>
          <Form method="post" action="/logout" ref={ref}>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </Form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
