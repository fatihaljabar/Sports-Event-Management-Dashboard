"use client";

import { ReactNode } from "react";
import { AthleteSidebar } from "./AthleteSidebar";
import { AthleteTopHeader } from "./AthleteTopHeader";

interface AthleteLayoutProps {
  children: ReactNode;
}

export function AthleteLayout({ children }: AthleteLayoutProps) {
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#f8f9fb", fontFamily: "Inter, sans-serif" }}
    >
      <AthleteSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AthleteTopHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
