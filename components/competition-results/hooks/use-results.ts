"use client";

import { useState, useMemo } from "react";
import { RESULTS, EVENTS, SPORTS, STATUSES } from "../constants";

export function useResults() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(EVENTS[0]);
  const [sportFilter, setSportFilter] = useState(SPORTS[0]);
  const [statusFilter, setStatusFilter] = useState(STATUSES[0]);

  const filtered = useMemo(() => {
    return RESULTS.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.gold.name.toLowerCase().includes(q) ||
        (r.silver?.name.toLowerCase().includes(q) ?? false) ||
        (r.bronze?.name.toLowerCase().includes(q) ?? false) ||
        r.matchId.toLowerCase().includes(q) ||
        r.sport.toLowerCase().includes(q) ||
        r.recordedBy.toLowerCase().includes(q);
      const matchEvent  = eventFilter  === EVENTS[0]   || r.event === eventFilter;
      const matchSport  = sportFilter  === SPORTS[0]    || r.sport.toLowerCase().includes(sportFilter.toLowerCase());
      const matchStatus = statusFilter === STATUSES[0]  || r.status === statusFilter.toLowerCase();
      return matchSearch && matchEvent && matchSport && matchStatus;
    });
  }, [search, eventFilter, sportFilter, statusFilter]);

  const officialCount    = useMemo(() => RESULTS.filter((r) => r.status === "official").length,    []);
  const provisionalCount = useMemo(() => RESULTS.filter((r) => r.status === "provisional").length, []);
  const disputedCount    = useMemo(() => RESULTS.filter((r) => r.status === "disputed").length,    []);

  const activeFilters = [eventFilter !== EVENTS[0], sportFilter !== SPORTS[0], statusFilter !== STATUSES[0]].filter(Boolean).length;

  const clearFilters = () => {
    setEventFilter(EVENTS[0]);
    setSportFilter(SPORTS[0]);
    setStatusFilter(STATUSES[0]);
  };

  return {
    search,
    setSearch,
    eventFilter,
    setEventFilter,
    sportFilter,
    setSportFilter,
    statusFilter,
    setStatusFilter,
    filtered,
    officialCount,
    provisionalCount,
    disputedCount,
    activeFilters,
    clearFilters,
    totalResults: RESULTS.length,
  };
}
