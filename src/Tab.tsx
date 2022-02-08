import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Tab({ children }: Props) {
  return (
    <div className="rounded-tl-lg rounded-tr-lg bg-slate-300 w-20 flex align-center justify-center">
      {children}
    </div>
  );
}
