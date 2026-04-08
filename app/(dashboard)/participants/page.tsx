"use client";

import { Suspense } from "react";
import { ParticipantsPage } from "@/components/admin/participants";

export default function ParticipantsRoutePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <ParticipantsPage />
    </Suspense>
  );
}
