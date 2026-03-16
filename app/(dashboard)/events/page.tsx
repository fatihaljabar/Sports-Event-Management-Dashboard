"use client";

import { useState, Suspense } from "react";
import { EventManagementPage } from "@/components/event-management";
import { CreateEventModal } from "@/components/CreateEventModal";
import { useRouter, useSearchParams } from "next/navigation";

function EventsPageContent() {
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

  const handleSearchClear = () => {
    // Navigate to /events without search param to clear URL
    router.push("/events");
  };

  return (
    <>
      <EventManagementPage
        onCreateEvent={handleCreateEvent}
        onEventClick={handleEventClick}
        initialSearch={initialSearch}
        onSearchClear={handleSearchClear}
      />
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}
