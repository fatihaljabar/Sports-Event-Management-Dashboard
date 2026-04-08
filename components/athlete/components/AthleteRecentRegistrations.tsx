"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Clock, UserRoundCheck, Flag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { AddAthleteModal } from "./AddAthleteModal";
import {
  RECENT_ATHLETES,
  RECENT_COACHES,
  RECENT_REFEREES,
} from "../constants";
import type { RecentRegistration, RecentCoach, RecentReferee } from "../types";

export function AthleteRecentRegistrations() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <AddAthleteModal onClose={() => setShowModal(false)} />}

      <div className="flex flex-col gap-4">
        {/* ── Recent Athlete Registrations ── */}
        <div
          className="bg-white rounded-xl border flex flex-col"
          style={{
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Card Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f9fafb" }}
          >
            <h3
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Recent Athlete Registrations
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "6px",
                paddingBottom: "6px",
                backgroundColor: "#2563eb",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb";
              }}
            >
              <Plus size={14} />
              Add Athlete
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    PLAYER
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    TEAM
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ATHLETES.map((athlete: RecentRegistration) => (
                  <tr
                    key={athlete.id}
                    style={{ borderBottom: "1px solid #f9fafb" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "rgba(249,250,251,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={athlete.photo}
                          alt={athlete.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 2px #f3f4f6" }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {athlete.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        {athlete.team}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {athlete.status === "Verified" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#059669",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#fffbeb",
                            color: "#d97706",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {athlete.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Coach Registrations ── */}
        <div
          className="bg-white rounded-xl border flex flex-col"
          style={{
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f9fafb" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-md"
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#f5f3ff",
                }}
              >
                <UserRoundCheck size={13} style={{ color: "#7c3aed" }} />
              </div>
              <h3
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Recent Coach Registrations
              </h3>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "6px",
                paddingBottom: "6px",
                backgroundColor: "#7c3aed",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6d28d9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#7c3aed";
              }}
            >
              <Plus size={14} />
              Add Coach
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    COACH
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    TEAM
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_COACHES.map((coach: RecentCoach) => (
                  <tr
                    key={coach.id}
                    style={{ borderBottom: "1px solid #f9fafb" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "rgba(249,250,251,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={coach.photo}
                          alt={coach.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 2px #f3f4f6" }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {coach.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>
                        {coach.team}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {coach.status === "Verified" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#059669",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#fffbeb",
                            color: "#d97706",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {coach.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Referee Registrations ── */}
        <div
          className="bg-white rounded-xl border flex flex-col"
          style={{
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f9fafb" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-md"
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#fff7ed",
                }}
              >
                <Flag size={13} style={{ color: "#ea580c" }} />
              </div>
              <h3
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Recent Referee Registrations
              </h3>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "6px",
                paddingBottom: "6px",
                backgroundColor: "#ea580c",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c2410c";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ea580c";
              }}
            >
              <Plus size={14} />
              Add Referee
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    REFEREE
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    BADGE
                  </th>
                  <th
                    className="text-left px-3 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5"
                    style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_REFEREES.map((ref: RecentReferee) => (
                  <tr
                    key={ref.id}
                    style={{ borderBottom: "1px solid #f9fafb" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "rgba(249,250,251,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={ref.photo}
                          alt={ref.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 2px #f3f4f6" }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1f2937",
                          }}
                        >
                          {ref.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          backgroundColor:
                            ref.badge === "FIFA Licensed" ? "#eff6ff" : "#f5f3ff",
                          color:
                            ref.badge === "FIFA Licensed" ? "#2563eb" : "#7c3aed",
                        }}
                      >
                        {ref.badge}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {ref.status === "Verified" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#059669",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#fffbeb",
                            color: "#d97706",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {ref.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
