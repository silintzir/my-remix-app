import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Link, NavLink } from "@remix-run/react";
import { Container } from "./container";
import { Logo } from "./logo";
import { Button } from "../ui/button";

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation({ isLogged }: HeaderProps) {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <Link to="#features">Features</Link>
            <Link to="#solutions">Solutions</Link>
            <Link to="#aboutus">About us</Link>
            <Link to="/register">Register</Link>
            {isLogged ? (
              <Link to="/account/dashboard">My account</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

interface HeaderProps {
  isLogged: boolean;
}
export function Header({ isLogged }: HeaderProps) {
  return (
    <header className="pt-8">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link to="/" aria-label="Home">
              <Logo />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink to="#features">Features</NavLink>
              <NavLink to="#solutions">Solutions</NavLink>
              <NavLink to="#aboutus">About us</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block space-x-5">
              <NavLink to="/register">Register</NavLink>
              {isLogged ? (
                <Button asChild className="text-base">
                  <NavLink to="/account/dashboard">My account</NavLink>
                </Button>
              ) : (
                <NavLink to="/login">Login</NavLink>
              )}
            </div>

            <div className="-mr-1 md:hidden">
              <MobileNavigation isLogged={isLogged} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
