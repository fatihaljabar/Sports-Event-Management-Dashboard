"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Clock, Users, UserRoundCheck, Flag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { AddAthleteModal } from "../modals/AddAthleteModal";
import {
  RECENT_ATHLETES,
  RECENT_COACHES,
  RECENT_REFEREES,
} from "../constants";

export function AthleteRecentRegistrations() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <AddAthleteModal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col gap-4">

        {/* ── Recent Athlete Registrations ── */}
        <div
          className="bg-white rounded-xl border shadow-sm flex flex-col"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Card Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#f9fafb" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <Users size={13} style={{ color: "#2563eb" }} />
              </span>
              <h3
                className="text-gray-900"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Recent Athlete Registrations
              </h3>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                backgroundColor: "#2563eb",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#1d4ed8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#2563eb")
              }
            >
              <Plus size={14} />
              Add Athlete
            </button>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    PLAYER
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    TEAM
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ATHLETES.map((athlete) => (
                  <tr
                    key={athlete.id}
                    className="border-b last:border-none hover:bg-gray-50/50 transition-colors"
                    style={{ borderColor: "#f9fafb" }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={athlete.photo}
                          alt={athlete.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{}}
                        />
                        <span
                          className="text-gray-800"
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          {athlete.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-gray-500" style={{ fontSize: "13px" }}>
                        {athlete.team}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {athlete.status === "Verified" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#fef3c7",
                            color: "#d97706",
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-gray-400" style={{ fontSize: "12px" }}>
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
          className="bg-white rounded-xl border shadow-sm flex flex-col"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#f9fafb" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ backgroundColor: "#f5f3ff" }}
              >
                <UserRoundCheck size={13} style={{ color: "#7c3aed" }} />
              </span>
              <h3
                className="text-gray-900"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Recent Coach Registrations
              </h3>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                backgroundColor: "#7c3aed",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#6d28d9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#7c3aed")
              }
            >
              <Plus size={14} />
              Add Coach
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    COACH
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    TEAM
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_COACHES.map((coach) => (
                  <tr
                    key={coach.id}
                    className="border-b last:border-none hover:bg-gray-50/50 transition-colors"
                    style={{ borderColor: "#f9fafb" }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={coach.photo}
                          alt={coach.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{}}
                        />
                        <span
                          className="text-gray-800"
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          {coach.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-gray-500" style={{ fontSize: "13px" }}>
                        {coach.team}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {coach.status === "Verified" ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#fef3c7",
                            color: "#d97706",
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-gray-400" style={{ fontSize: "12px" }}>
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
          className="bg-white rounded-xl border shadow-sm flex flex-col"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#f9fafb" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ backgroundColor: "#fff7ed" }}
              >
                <Flag size={13} style={{ color: "#ea580c" }} />
              </span>
              <h3
                className="text-gray-900"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Recent Referee Registrations
              </h3>
            </div>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-colors active:scale-95 shadow-sm"
              style={{
                backgroundColor: "#ea580c",
                fontSize: "12px",
                fontWeight: 600,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#c2410c")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#ea580c")
              }
            >
              <Plus size={14} />
              Add Referee
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#f9fafb" }}>
                  <th
                    className="text-left px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    REFEREE
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    BADGE
                  </th>
                  <th
                    className="text-left px-3 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    STATUS
                  </th>
                  <th
                    className="text-right px-5 py-2.5 text-gray-400"
                    style={{ fontSize: "11px", fontWeight: 500 }}
                  >
                    ADDED
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_REFEREES.map((ref) => (
                  <tr
                    key={ref.id}
                    className="border-b last:border-none hover:bg-gray-50/50 transition-colors"
                    style={{ borderColor: "#f9fafb" }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={ref.photo}
                          alt={ref.name}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{}}
                        />
                        <span
                          className="text-gray-800"
                          style={{ fontSize: "13px", fontWeight: 500 }}
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
                            ref.badge === "FIFA Licensed"
                              ? "#eff6ff"
                              : "#f5f3ff",
                          color:
                            ref.badge === "FIFA Licensed"
                              ? "#2563eb"
                              : "#7c3aed",
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
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#dcfce7",
                            color: "#16a34a",
                          }}
                        >
                          <CheckCircle2 size={11} />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "#fef3c7",
                            color: "#d97706",
                          }}
                        >
                          <Clock size={11} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-gray-400" style={{ fontSize: "12px" }}>
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
