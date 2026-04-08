"use client";

import { AthleteLayout } from "@/components/athlete/layout/AthleteLayout";

export default function RosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AthleteLayout>{children}</AthleteLayout>;
}
