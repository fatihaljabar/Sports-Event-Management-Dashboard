"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ShieldOff, RotateCcw, Trash2 } from "lucide-react";
import { useEvents } from "@/lib/stores/event-store";
import { getKeysByEvent, revokeKey, restoreKey, deleteKey } from "@/app/actions/keys";
import { toast } from "sonner";
import type { KeyStatus, SportKey } from "../constants";
import { transformAccessKeyToSportKey } from "../utils";

/**
 * Custom hook for key management data and operations
 * Handles fetching, filtering, and CRUD operations for access keys
 */
export function useKeyManagement(eventId: string | undefined) {
  const { getEventById, isLoading, refreshEvents } = useEvents();
  const event = eventId ? getEventById(eventId) : null;

  // Track if initial load is complete (to prevent blinking on auto-refresh)
  const isInitialLoad = useRef(true);
  // Track last fetched event ID to prevent duplicate fetches on store refresh
  const lastFetchedEventIdRef = useRef<string | null>(null);

  // Keys state
  const [keys, setKeys] = useState<SportKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | KeyStatus>("all");

  // Fetch keys from database
  const fetchKeys = useCallback(async () => {
    if (!event?.id) return;

    setIsLoadingKeys(true);
    try {
      const result = await getKeysByEvent(event.id);
      if (result.success && result.keys) {
        const transformedKeys = result.keys.map(transformAccessKeyToSportKey);
        setKeys(transformedKeys);
      }
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    } finally {
      setIsLoadingKeys(false);
    }
  }, [event?.id]);

  // Fetch keys when event changes
  useEffect(() => {
    // Only fetch if event ID actually changed (prevents duplicate fetches on store refresh)
    if (event?.id && event.id !== lastFetchedEventIdRef.current) {
      fetchKeys();
      lastFetchedEventIdRef.current = event.id;
      // Mark initial load as complete once we have the event
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
    }
  }, [event?.id, fetchKeys]);

  // Event handlers
  const handleRevoke = useCallback(async (id: string) => {
    try {
      const result = await revokeKey(id);
      if (result.success) {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k))
        );
        toast.error("Key revoked successfully", {
          description: "The access key has been revoked.",
          icon: <ShieldOff className="w-5 h-5" />,
          className: "revoke-toast",
        });
      } else {
        toast.error("Failed to revoke key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, []);

  const handleRestore = useCallback(async (id: string) => {
    try {
      const result = await restoreKey(id);
      if (result.success) {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: "available" as KeyStatus } : k))
        );
        toast.success("Key restored successfully", {
          description: "The access key has been restored to available.",
          icon: <RotateCcw className="w-5 h-5" />,
          className: "restore-toast",
        });
      } else {
        toast.error("Failed to restore key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const result = await deleteKey(id);
      if (result.success) {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        // Refresh events to update totalKeys in the store
        await refreshEvents();
        toast("Key deleted successfully", {
          description: "The access key has been permanently deleted.",
          icon: <Trash2 className="w-5 h-5" />,
          className: "delete-toast",
        });
      } else {
        toast.error("Failed to delete key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [refreshEvents]);

  // Filter keys based on search and status
  const filtered = keys.filter((k) => {
    const matchStatus = statusFilter === "all" || k.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      k.code.toLowerCase().includes(q) ||
      k.sport.toLowerCase().includes(q) ||
      k.userEmail?.toLowerCase().includes(q) ||
      k.userName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Status tabs with counts
  const statusTabs = [
    { id: "all" as const, label: "All Keys", count: keys.length },
    { id: "available" as const, label: "Available", count: keys.filter((k) => k.status === "available").length },
    { id: "confirmed" as const, label: "Confirmed", count: keys.filter((k) => k.status === "confirmed").length },
    { id: "revoked" as const, label: "Revoked", count: keys.filter((k) => k.status === "revoked").length },
  ];

  // Stats
  const total = event?.totalKeys ?? 0;
  const generated = keys.length;
  const confirmed = keys.filter((k) => k.status === "confirmed").length;

  return {
    // Event data
    event,
    isLoading: isLoading || (eventId && !event),
    isInitialLoad: isInitialLoad.current,
    // Keys data
    keys,
    filtered,
    isLoadingKeys,
    // Search & filter
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    statusTabs,
    // Stats
    total,
    generated,
    confirmed,
    // Handlers
    fetchKeys,
    handleRevoke,
    handleRestore,
    handleDelete,
  };
}
