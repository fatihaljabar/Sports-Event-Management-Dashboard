"use client";

import React, { useState } from "react";
import { Search, X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import type { KeyStatus, SportKey } from "../constants";
import { STATUS_CFG, ITEMS_PER_PAGE } from "../constants";
import { KeyRow } from "./KeyRow";
import { EmptyState } from "./EmptyState";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  paginatedItems: SportKey[];
  pageNumbers: (number | string)[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
}

interface KeysTableProps {
  filtered: SportKey[];
  statusFilter: "all" | KeyStatus;
  search: string;
  statusTabs: Array<{ id: "all" | KeyStatus; label: string; count: number }>;
  onStatusFilterChange: (filter: "all" | KeyStatus) => void;
  onSearchChange: (value: string) => void;
  pagination: PaginationData;
  onGenerateKeys: () => void;
  onRevoke: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
  eventStatus?: "active" | "upcoming" | "completed" | "archived";
}

export function KeysTable({
  filtered,
  statusFilter,
  search,
  statusTabs,
  onStatusFilterChange,
  onSearchChange,
  pagination,
  onGenerateKeys,
  onRevoke,
  onRestore,
  onDelete,
  isReadOnly = false,
  eventStatus = "active",
}: KeysTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    hasPrevPage,
    hasNextPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
  } = pagination;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #F1F5F9" }}
      >
        {/* Status filter tabs */}
        <div className="flex items-center gap-1">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            const cfg = tab.id !== "all" ? STATUS_CFG[tab.id as KeyStatus] : null;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all"
                style={{
                  backgroundColor: isActive ? "#EFF6FF" : "transparent",
                  border: `1.5px solid ${isActive ? "#BFDBFE" : "transparent"}`,
                  color: isActive ? "#1D4ED8" : "#64748B",
                  fontSize: "0.8rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                {cfg && (
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{ width: "6px", height: "6px", backgroundColor: cfg.dot }}
                  />
                )}
                {tab.label}
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    minWidth: "18px",
                    height: "18px",
                    padding: "0 5px",
                    backgroundColor: isActive ? "#2563EB" : "#F1F5F9",
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    fontSize: "0.6rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 600,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex items-center" style={{ width: "280px" }}>
          <Search className="absolute left-3 w-3.5 h-3.5" strokeWidth={1.75} style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Search email, username, or key…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg outline-none transition-all"
            style={{
              paddingLeft: "2rem",
              paddingRight: search ? "2rem" : "0.75rem",
              paddingTop: "0.45rem",
              paddingBottom: "0.45rem",
              backgroundColor: "#F8FAFC",
              border: "1.5px solid #E2E8F0",
              fontSize: "0.78rem",
              fontFamily: '"Inter", sans-serif',
              color: "#1E293B",
            }}
            onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#2563EB")}
            onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "#E2E8F0")}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3"
              style={{ color: "#94A3B8" }}
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFBFC" }}>
              {[
                { label: "No.", width: "5%", align: "center" as const },
                { label: "Access Key", width: "22%" },
                { label: "Assigned Sport", width: "16%" },
                { label: "User Status", width: "20%" },
                { label: "Registered User", width: "27%" },
                { label: "Actions", width: "10%", align: "center" as const },
              ].map((col) => (
                <th
                  key={col.label}
                  style={{
                    width: col.width,
                    padding: "10px 20px",
                    textAlign: col.align ?? "left",
                    borderBottom: "1.5px solid #F1F5F9",
                    color: "#94A3B8",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontFamily: '"Inter", sans-serif',
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState onGenerate={onGenerateKeys} />
                </td>
              </tr>
            ) : (
              paginatedItems.map((key, idx) => (
                <KeyRow
                  key={key.id}
                  idx={(currentPage - 1) * ITEMS_PER_PAGE + idx}
                  keyItem={key}
                  isLast={idx === paginatedItems.length - 1}
                  hovered={hoveredRow === key.id}
                  onHover={setHoveredRow}
                  onRevoke={onRevoke}
                  onRestore={onRestore}
                  onDelete={onDelete}
                  isReadOnly={isReadOnly}
                  eventStatus={eventStatus}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}
      >
        <span style={{ color: "#94A3B8", fontSize: "0.75rem", fontFamily: '"Inter", sans-serif' }}>
          Showing{" "}
          <span style={{ color: "#374151", fontWeight: 500 }}>
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>
          {"–"}
          <span style={{ color: "#374151", fontWeight: 500 }}>
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
          </span>
          {" "}of{" "}
          <span style={{ color: "#374151", fontWeight: 500 }}>{filtered.length}</span>{" "}
          keys
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Previous button */}
            <button
              onClick={goToPrevPage}
              disabled={!hasPrevPage}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "transparent",
                color: !hasPrevPage ? "#CBD5E1" : "#64748B",
                fontSize: "0.78rem",
                border: `1.5px solid ${!hasPrevPage ? "#F1F5F9" : "#E2E8F0"}`,
                cursor: !hasPrevPage ? "not-allowed" : "pointer",
                opacity: !hasPrevPage ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (hasPrevPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                }
              }}
              onMouseLeave={(e) => {
                if (hasPrevPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                }
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>

            {/* Page numbers - show max 5 pages with ellipsis */}
            {pageNumbers.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    padding: "0 4px",
                  }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => goToPage(page as number)}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: page === currentPage ? "#2563EB" : "transparent",
                    color: page === currentPage ? "#FFFFFF" : "#64748B",
                    fontSize: "0.78rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: page === currentPage ? 600 : 400,
                    border: `1.5px solid ${page === currentPage ? "#2563EB" : "#E2E8F0"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (page !== currentPage) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== currentPage) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {page}
                </button>
              )
            )}

            {/* Next button */}
            <button
              onClick={goToNextPage}
              disabled={!hasNextPage}
              className="flex items-center justify-center rounded-lg transition-all"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "transparent",
                color: !hasNextPage ? "#CBD5E1" : "#64748B",
                fontSize: "0.78rem",
                border: `1.5px solid ${!hasNextPage ? "#F1F5F9" : "#E2E8F0"}`,
                cursor: !hasNextPage ? "not-allowed" : "pointer",
                opacity: !hasNextPage ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (hasNextPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#CBD5E1";
                }
              }}
              onMouseLeave={(e) => {
                if (hasNextPage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                }
              }}
            >
              <ChevronRightIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
