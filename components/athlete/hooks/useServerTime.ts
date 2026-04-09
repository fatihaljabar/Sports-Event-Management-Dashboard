"use client";

import { useQuery } from "@tanstack/react-query";

interface SyncResponse {
  timestamp: string;
  status: string;
  type: string;
}

async function fetchServerTime(): Promise<Date> {
  const res = await fetch("/api/sync?type=roster");
  if (!res.ok) throw new Error("Failed to fetch server time");
  const data: SyncResponse = await res.json();
  return new Date(data.timestamp);
}

export function useServerTime() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["server-time"],
    queryFn: fetchServerTime,
    refetchInterval: 30 * 1000, // poll every 30 seconds
    staleTime: 25 * 1000,
    retry: 2,
    retryDelay: 1000,
  });

  // Fallback to client time if server fetch fails or still loading
  const serverTime = isLoading || isError || !data ? new Date() : data;

  const timeStr = serverTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = serverTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return { timeStr, dateStr, isLoading };
}
