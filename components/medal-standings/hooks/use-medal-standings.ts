"use client";

import { useState, useMemo } from "react";
import { ATHLETES, COUNTRIES, EVENTS, TEAMS, SPORTS } from "../constants";
import type { ViewMode, GenderFilter } from "../types";

export function useMedalStandings() {
  const [view, setView] = useState<ViewMode>("athlete");
  const [eventFilter, setEventFilter] = useState<string>(EVENTS[0]);
  const [teamFilter, setTeamFilter] = useState<string>(TEAMS[0]);
  const [sportFilter, setSportFilter] = useState<string>(SPORTS[0]);
  const [gender, setGender] = useState<GenderFilter>("All");
  const [search, setSearch] = useState("");

  const sortedAthletes = useMemo(() => {
    return [...ATHLETES]
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.countryFull.toLowerCase().includes(q);
        const matchEvent  = eventFilter === EVENTS[0] || a.event === eventFilter;
        const matchTeam   = teamFilter  === TEAMS[0]   || a.countryFull === teamFilter;
        const matchSport  = sportFilter === SPORTS[0] || a.sport === sportFilter;
        const matchGender = gender === "All" || a.gender === gender;
        return matchSearch && matchEvent && matchTeam && matchSport && matchGender;
      })
      .sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze);
  }, [search, eventFilter, teamFilter, sportFilter, gender]);

  const sortedCountries = useMemo(() => {
    return [...COUNTRIES].sort(
      (a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze
    );
  }, []);

  const activeFilters = [
    eventFilter !== EVENTS[0],
    teamFilter  !== TEAMS[0],
    sportFilter !== SPORTS[0],
    gender !== "All",
  ].filter(Boolean).length;

  const totalMedals = useMemo(
    () => ATHLETES.reduce((acc, a) => acc + a.gold + a.silver + a.bronze, 0),
    []
  );

  const clearFilters = () => {
    setEventFilter(EVENTS[0]);
    setTeamFilter(TEAMS[0]);
    setSportFilter(SPORTS[0]);
    setGender("All");
  };

  return {
    view,
    setView,
    eventFilter,
    setEventFilter,
    teamFilter,
    setTeamFilter,
    sportFilter,
    setSportFilter,
    gender,
    setGender,
    search,
    setSearch,
    sortedAthletes,
    sortedCountries,
    activeFilters,
    clearFilters,
    totalMedals,
  };
}
