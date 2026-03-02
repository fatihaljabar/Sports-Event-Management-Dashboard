"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldOff, RotateCcw, Trash2 } from "lucide-react";
import { useEvents } from "@/lib/stores/event-store";
import { getKeysByEvent, revokeKey, restoreKey, deleteKey } from "@/app/actions/keys";
import { toast } from "sonner";
import type { KeyStatus, SportKey } from "../constants";
import { transformAccessKeyToSportKey } from "../utils";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** Polling interval for keys data (10 seconds) */
const KEYS_REFETCH_INTERVAL = 10000;

/** Query key for fetching keys by event */
const getKeysQueryKey = (eventId: string) => ["keys", eventId] as const;

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

/**
 * Custom hook for key management data and operations
 * Handles fetching, filtering, and CRUD operations for access keys
 *
 * Features:
 * - Auto-polling every 10 seconds via TanStack Query
 * - Pauses polling when tab is inactive (Page Visibility API)
 * - Optimistic updates for revoke/restore/delete
 * - Automatic cache invalidation
 */
export function useKeyManagement(eventId: string | undefined) {
  const { getEventById, isLoading, refreshEvents } = useEvents();
  const event = eventId ? getEventById(eventId) : null;

  // Track if initial load is complete (to prevent blinking on auto-refresh)
  const isInitialLoad = useRef(true);

  // Keys state for optimistic updates
  const [keys, setKeys] = useState<SportKey[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | KeyStatus>("all");

  // ═══════════════════════════════════════════════════════════════
  // PAGE VISIBILITY TRACKING
  // ═══════════════════════════════════════════════════════════════

  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // FETCH KEYS WITH TANSTACK QUERY (POLLING)
  // ═══════════════════════════════════════════════════════════════

  const {
    data: fetchedKeys = [],
    isLoading: isLoadingKeys,
    refetch: refetchKeys,
  } = useQuery({
    queryKey: getKeysQueryKey(event?.id ?? ""),
    queryFn: async () => {
      if (!event?.id) return [];
      const result = await getKeysByEvent(event.id);
      if (result.success && result.keys) {
        return result.keys.map(transformAccessKeyToSportKey);
      }
      throw new Error(result.error || "Failed to fetch keys");
    },
    enabled: !!event?.id,
    refetchInterval: isTabVisible ? KEYS_REFETCH_INTERVAL : false, // Pause when tab hidden
    refetchIntervalInBackground: false, // Never poll when tab is background
    refetchOnWindowFocus: false, // Don't refetch on tab switch (we use interval)
    staleTime: 5000, // Consider data fresh for 5 seconds
    retry: 1, // Only retry once on failure
  });

  // Update local keys state when fetched data changes
  useEffect(() => {
    if (fetchedKeys.length > 0 || keys.length === 0) {
      setKeys(fetchedKeys);
    }
    if (isInitialLoad.current && fetchedKeys.length > 0) {
      isInitialLoad.current = false;
    }
  }, [fetchedKeys]);

  // Manual fetch function (for use after mutations)
  const fetchKeys = useCallback(() => {
    refetchKeys();
  }, [refetchKeys]);

  // ═══════════════════════════════════════════════════════════════
  // EVENT HANDLERS (OPTIMISTIC UPDATES)
  // ═══════════════════════════════════════════════════════════════

  const handleRevoke = useCallback(async (id: string) => {
    // Optimistic update
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k))
    );

    try {
      const result = await revokeKey(id);
      if (result.success) {
        toast.error("Key revoked successfully", {
          description: "The access key has been revoked.",
          icon: <ShieldOff className="w-5 h-5" />,
          className: "revoke-toast",
        });
        // Refetch to ensure consistency with server
        refetchKeys();
      } else {
        // Revert on failure
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: "available" as KeyStatus } : k))
        );
        toast.error("Failed to revoke key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      // Revert on error
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "available" as KeyStatus } : k))
      );
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [refetchKeys]);

  const handleRestore = useCallback(async (id: string) => {
    // Optimistic update
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "available" as KeyStatus } : k))
    );

    try {
      const result = await restoreKey(id);
      if (result.success) {
        toast.success("Key restored successfully", {
          description: "The access key has been restored to available.",
          icon: <RotateCcw className="w-5 h-5" />,
          className: "restore-toast",
        });
        refetchKeys();
      } else {
        // Revert on failure
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k))
        );
        toast.error("Failed to restore key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      // Revert on error
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k))
      );
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [refetchKeys]);

  const handleDelete = useCallback(async (id: string) => {
    // Optimistic update
    const previousKeys = keys;
    setKeys((prev) => prev.filter((k) => k.id !== id));

    try {
      const result = await deleteKey(id);
      if (result.success) {
        // Refresh events to update totalKeys in the store
        await refreshEvents();
        toast("Key deleted successfully", {
          description: "The access key has been permanently deleted.",
          icon: <Trash2 className="w-5 h-5" />,
          className: "delete-toast",
        });
        // Invalidate and refetch keys query
        refetchKeys();
      } else {
        // Revert on failure
        setKeys(previousKeys);
        toast.error("Failed to delete key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      // Revert on error
      setKeys(previousKeys);
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [keys, refreshEvents, refetchKeys]);

  // ═══════════════════════════════════════════════════════════════
  // FILTERING & STATS
  // ═══════════════════════════════════════════════════════════════

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
