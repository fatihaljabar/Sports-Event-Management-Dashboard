"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardSyncResponse {
  timestamp: string;
  status: "ok";
}

/**
 * Hook for dashboard sync status
 *
 * Provides:
 * - dataUpdatedAt: timestamp of last successful fetch
 * - isFetching: whether query is currently fetching
 * - refetch: function to manually refresh
 *
 * Automatically refetches every 60 seconds
 */
export function useDashboardSync() {
  const query = useQuery<DashboardSyncResponse>({
    queryKey: ["dashboard-sync"],
    queryFn: async () => {
      // Lightweight sync check - could be replaced with actual API call
      // For now, just returns current server timestamp
      const response = await fetch("/api/sync?type=dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      return response.json();
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
  });

  return {
    lastSyncTime: query.dataUpdatedAt,
    isSyncing: query.isFetching,
    refetch: query.refetch,
  };
}
