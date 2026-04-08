"use client";

import { ReactNode } from "react";
import { AthleteLayout } from "@/components/athlete/components/AthleteLayout";

interface AthleteRouteLayoutProps {
  children: ReactNode;
}

export default function AthleteRouteLayout({ children }: AthleteRouteLayoutProps) {
  return <AthleteLayout>{children}</AthleteLayout>;
}
