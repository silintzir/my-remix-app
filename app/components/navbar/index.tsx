import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function NavBar({ children }: Props) {
  return (
    <header className="h-20 relative z-50 block bg-white border-b shadow-lg">
      <div className="fixed top-0 left-0 right-0 h-inherit">
        <div className="flex justify-between items-center px-8 relative h-inherit">
          {children}
        </div>
      </div>
    </header>
  );
}
