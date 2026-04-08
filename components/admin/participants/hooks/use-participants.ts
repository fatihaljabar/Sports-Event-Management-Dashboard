"use client";

import { useState, useMemo } from "react";
import { ORGANIZERS, EVENTS, DIVISIONS } from "../constants";

export function useParticipants() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState(EVENTS[0]);
  const [divFilter, setDivFilter] = useState(DIVISIONS[0]);

  const filtered = useMemo(() => {
    return ORGANIZERS.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.accessKey.toLowerCase().includes(q) ||
        o.role.toLowerCase().includes(q);
      const matchEvent = eventFilter === EVENTS[0] || o.event === eventFilter;
      const matchDiv =
        divFilter === DIVISIONS[0] || o.division.startsWith(divFilter.replace(" — Men", ""));
      return matchSearch && matchEvent && matchDiv;
    });
  }, [search, eventFilter, divFilter]);

  const activeCount = useMemo(
    () => ORGANIZERS.filter((o) => o.status === "active").length,
    []
  );

  const revokedCount = useMemo(
    () => ORGANIZERS.filter((o) => o.status === "revoked").length,
    []
  );

  const activeFilters = [eventFilter !== EVENTS[0], divFilter !== DIVISIONS[0]].filter(
    Boolean
  ).length;

  const clearFilters = () => {
    setEventFilter(EVENTS[0]);
    setDivFilter(DIVISIONS[0]);
  };

  return {
    search,
    setSearch,
    eventFilter,
    setEventFilter,
    divFilter,
    setDivFilter,
    filtered,
    activeCount,
    revokedCount,
    activeFilters,
    clearFilters,
    totalOrganizers: ORGANIZERS.length,
  };
}
