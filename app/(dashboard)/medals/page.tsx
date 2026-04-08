"use client";

import { Suspense } from "react";
import { MedalStandingsPage } from "@/components/admin/medal-standings/MedalStandingsPage";

export default function MedalsRoutePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <MedalStandingsPage />
    </Suspense>
  );
}
