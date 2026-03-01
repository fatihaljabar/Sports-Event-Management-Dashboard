"use client";

import { useState } from "react";
import { EventManagementPage } from "@/components/event-management";
import { CreateEventModal } from "@/components/CreateEventModal";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      />
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
