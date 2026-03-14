"use client";

import { useParams, useRouter } from "next/navigation";
import { KeyManagementPage } from "@/components/key-management";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/events");
    }
  };

  const handleNavigateToEvents = () => {
    router.push("/events");
  };

  return <KeyManagementPage onBack={handleBack} onNavigateToEvents={handleNavigateToEvents} eventId={eventId} />;
}
