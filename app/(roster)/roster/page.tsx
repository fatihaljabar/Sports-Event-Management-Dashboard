"use client";

import { WelcomeBanner } from "@/components/athlete";
import { AthleteStatsRow } from "@/components/athlete/dashboard/AthleteStatsRow";
import { AthleteRecentRegistrations } from "@/components/athlete/dashboard/AthleteRecentRegistrations";

export default function RosterDashboardPage() {
  return (
    <div className="p-6">
      <WelcomeBanner />
      <AthleteStatsRow />
      <div className="mt-4">
        <AthleteRecentRegistrations />
      </div>
    </div>
  );
}
