"use client";

import { useState } from "react";
import { EventManagementPage } from "@/components/event-management";
import { CreateEventModal } from "@/components/CreateEventModal";
import { useRouter, useSearchParams } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const initialSearch = searchParams?.get("search") || "";

  const handleCreateEvent = () => {
    setShowCreateModal(true);
  };

  const handleEventClick = (eventId: string) => {
    // Navigate to event detail page (to be implemented)
    router.push(`/events/${eventId}`);
  };

  return (
    <>
      <EventManagementPage
        onCreateEvent={handleCreateEvent}
        onEventClick={handleEventClick}
        initialSearch={initialSearch}
      />
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
