"use client";

import { AthleteSidebar } from "./AthleteSidebar";
import { AthleteTopHeader } from "./AthleteTopHeader";

export function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        backgroundColor: "#f8f9fb",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <AthleteSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AthleteTopHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
