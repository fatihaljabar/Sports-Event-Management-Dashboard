"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const event = eventId ? getEventById(eventId) : null;

  // Track if initial load is complete
  const isInitialLoad = useRef(true);

  // Search and filter state
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
    refetchInterval: isTabVisible ? KEYS_REFETCH_INTERVAL : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: 1,
  });

  // Track initial load completion
  useEffect(() => {
    if (isInitialLoad.current && fetchedKeys.length > 0) {
      isInitialLoad.current = false;
    }
  }, [fetchedKeys.length]);

  // Use fetchedKeys directly - no local state syncing (prevents infinite loop)
  const keys = fetchedKeys;

  // Manual fetch function
  const fetchKeys = useCallback(() => {
    refetchKeys();
  }, [refetchKeys]);

  // ═══════════════════════════════════════════════════════════════
  // EVENT HANDLERS (WITH OPTIMISTIC UPDATES)
  // ═══════════════════════════════════════════════════════════════

  const handleRevoke = useCallback(async (id: string) => {
    // Optimistic update - update cache directly
    queryClient.setQueryData(
      getKeysQueryKey(event?.id ?? ""),
      (old: SportKey[] | undefined) => {
        return old?.map((k) => (k.id === id ? { ...k, status: "revoked" as KeyStatus } : k)) ?? [];
      }
    );

    try {
      const result = await revokeKey(id);
      if (result.success) {
        toast.error("Key revoked successfully", {
          description: "The access key has been revoked.",
          icon: <ShieldOff className="w-5 h-5" />,
          className: "revoke-toast",
        });
        // Refetch to ensure server consistency
        refetchKeys();
      } else {
        // Revert by refetching
        refetchKeys();
        toast.error("Failed to revoke key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      refetchKeys();
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [event?.id, queryClient, refetchKeys]);

  const handleRestore = useCallback(async (id: string) => {
    // Optimistic update
    queryClient.setQueryData(
      getKeysQueryKey(event?.id ?? ""),
      (old: SportKey[] | undefined) => {
        return old?.map((k) => (k.id === id ? { ...k, status: "available" as KeyStatus } : k)) ?? [];
      }
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
        refetchKeys();
        toast.error("Failed to restore key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      refetchKeys();
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [event?.id, queryClient, refetchKeys]);

  const handleDelete = useCallback(async (id: string) => {
    // Store previous data for rollback
    const previousKeys = keys;

    // Optimistic update
    queryClient.setQueryData(
      getKeysQueryKey(event?.id ?? ""),
      (old: SportKey[] | undefined) => {
        return old?.filter((k) => k.id !== id) ?? [];
      }
    );

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
      } else {
        // Revert by restoring previous data
        queryClient.setQueryData(
          getKeysQueryKey(event?.id ?? ""),
          previousKeys
        );
        toast.error("Failed to delete key", {
          description: result.error || "Please try again.",
        });
      }
    } catch (error) {
      // Revert
      queryClient.setQueryData(
        getKeysQueryKey(event?.id ?? ""),
        previousKeys
      );
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }, [keys, event?.id, queryClient, refreshEvents, refetchKeys]);

  // ═══════════════════════════════════════════════════════════════
  // FILTERING & STATS
  // ═══════════════════════════════════════════════════════════════

  // Filter keys based on search and status
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return keys.filter((k: SportKey) => {
      const matchStatus = statusFilter === "all" || k.status === statusFilter;
      if (!q) return matchStatus;
      return (
        matchStatus &&
        (k.code.toLowerCase().includes(q) ||
          k.sport.toLowerCase().includes(q) ||
          (k.userEmail && k.userEmail.toLowerCase().includes(q)) ||
          (k.userName && k.userName.toLowerCase().includes(q)))
      );
    });
  }, [keys, search, statusFilter]);

  // Status tabs with counts
  const statusTabs = useMemo(() => {
    const availableCount = keys.filter((k) => k.status === "available").length;
    const confirmedCount = keys.filter((k) => k.status === "confirmed").length;
    const revokedCount = keys.filter((k) => k.status === "revoked").length;

    return [
      { id: "all" as const, label: "All Keys", count: keys.length },
      { id: "available" as const, label: "Available", count: availableCount },
      { id: "confirmed" as const, label: "Confirmed", count: confirmedCount },
      { id: "revoked" as const, label: "Revoked", count: revokedCount },
    ];
  }, [keys]);

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
