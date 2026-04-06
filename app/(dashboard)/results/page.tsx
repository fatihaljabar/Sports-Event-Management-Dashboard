"use client";

import { Suspense } from "react";
import { CompetitionResultsPage } from "@/components/competition-results";

export default function ResultsRoutePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <CompetitionResultsPage />
    </Suspense>
  );
}
