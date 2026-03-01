"use client";

import { useParams, useRouter } from "next/navigation";
import { KeyManagementPage } from "@/components/KeyManagementPage";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const handleBack = () => {
    router.push("/events");
  };

  return <KeyManagementPage onBack={handleBack} eventId={eventId} />;
}
