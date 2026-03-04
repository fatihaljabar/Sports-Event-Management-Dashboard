"use client";

import React, { useState } from "react";
import { useKeyManagement } from "./hooks/use-key-management";
import { usePagination } from "./hooks/use-pagination";
import { getCalculatedStatus } from "./utils";
import { KeyManagementHeader } from "./components/KeyManagementHeader";
import { KeysTable } from "./components/KeysTable";
import { GenerateKeysModal } from "./components/GenerateKeysModal";

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export interface KeyManagementPageProps {
  onBack: () => void;
  eventId?: string;
}

// Re-export types for convenience
export type { KeyStatus, SportKey } from "./constants";

export function KeyManagementPage({ onBack, eventId }: KeyManagementPageProps) {
  // Custom hook for keys data and operations
  const {
    event,
    isLoading,
    isInitialLoad,
    filtered,
    statusFilter,
    search,
    setSearch,
    setStatusFilter,
    statusTabs,
    total,
    generated,
    confirmed,
    fetchKeys,
    handleRevoke,
    handleRestore,
    handleDelete,
  } = useKeyManagement(eventId);

  // Custom hook for pagination
  const pagination = usePagination(filtered);

  // Modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Don't render anything while events are loading (prevents "unknown event" flash)
  // Only apply to initial load, not auto-refreshes (to prevent blinking)
  if (isInitialLoad && isLoading) {
    return null;
  }

  // Calculate event status
  const eventStatus = event
    ? getCalculatedStatus(event)
    : "upcoming";

  // Check if event is in read-only mode (completed events)
  const isReadOnly = eventStatus === "completed";

  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="px-6 py-6" style={{ maxWidth: "1600px" }}>

        {/* Header & Stat Cards */}
        <KeyManagementHeader
          event={event ?? null}
          eventStatus={eventStatus}
          total={total}
          generated={generated}
          confirmed={confirmed}
          onBack={onBack}
          onGenerateKeys={() => setShowGenerateModal(true)}
          isReadOnly={isReadOnly}
        />

        {/* Table with pagination */}
        <KeysTable
          filtered={filtered}
          statusFilter={statusFilter}
          search={search}
          statusTabs={statusTabs}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearch}
          pagination={pagination}
          onGenerateKeys={() => setShowGenerateModal(true)}
          onRevoke={handleRevoke}
          onRestore={handleRestore}
          onDelete={handleDelete}
          isReadOnly={isReadOnly}
        />

        <div style={{ height: "32px" }} />
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <GenerateKeysModal
          onClose={() => setShowGenerateModal(false)}
          eventName={event?.name ?? "Unknown Event"}
          eventId={event?.id ?? ""}
          eventSports={event?.sports}
          onKeysGenerated={fetchKeys}
          remainingQuota={total - generated}
          totalQuota={total}
        />
      )}
    </main>
  );
}
