"use client";

import { useState } from "react";
import { Minus, Plus, Radio, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export function QuickMatchInput() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const handleUpdate = () => {
    toast.success(`Score updated: Team Garuda ${homeScore} - ${awayScore} Team Elang`, {
      duration: 3000,
    });
  };

  return (
    <div
      className="bg-white rounded-xl border shadow-sm h-full flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#f9fafb" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#ef4444" }}
          />
          <h3
            className="text-gray-900"
            style={{
              fontFamily: "Barlow Condensed, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Quick Match Input
          </h3>
        </div>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          }}
        >
          <Radio size={12} />
          LIVE
        </span>
      </div>

      {/* Match Details */}
      <div className="px-5 pt-4 pb-2">
        <div
          className="flex items-center gap-3 text-gray-400"
          style={{ fontSize: "12px" }}
        >
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Group A - Match Day 3
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Main Stadium
          </span>
        </div>
      </div>

      {/* Score Input Area */}
      <div className="flex-1 px-5 py-4">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div
              className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #ef4444, #b91c1c)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              }}
            >
              <span style={{ fontSize: "24px", color: "white" }}>&#129413;</span>
            </div>
            <p
              className="text-gray-900"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Team Garuda
            </p>
            <p className="text-gray-400" style={{ fontSize: "11px" }}>
              Home
            </p>

            {/* Score Stepper */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors active:scale-95"
              >
                <Minus size={16} />
              </button>
              <div
                className="flex items-center justify-center w-16 h-16 rounded-xl text-white shadow-xl"
                style={{
                  backgroundColor: "#0a1628",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
                }}
              >
                {homeScore}
              </div>
              <button
                onClick={() => setHomeScore(homeScore + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors active:scale-95"
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#bfdbfe")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dbeafe")
                }
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-1 pt-6">
            <span
              className="text-gray-300"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              VS
            </span>
            <span className="text-gray-300" style={{ fontSize: "11px" }}>
              65&apos;
            </span>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div
              className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #f59e0b, #b45309)",
                boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
              }}
            >
              <span style={{ fontSize: "24px", color: "white" }}>&#129413;</span>
            </div>
            <p
              className="text-gray-900"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Team Elang
            </p>
            <p className="text-gray-400" style={{ fontSize: "11px" }}>
              Away
            </p>

            {/* Score Stepper */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors active:scale-95"
              >
                <Minus size={16} />
              </button>
              <div
                className="flex items-center justify-center w-16 h-16 rounded-xl text-white shadow-xl"
                style={{
                  backgroundColor: "#0a1628",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontSize: "36px",
                  fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
                }}
              >
                {awayScore}
              </div>
              <button
                onClick={() => setAwayScore(awayScore + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors active:scale-95"
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#bfdbfe")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dbeafe")
                }
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={handleUpdate}
          className="w-full py-3.5 rounded-xl text-white transition-colors shadow-lg active:scale-[0.98]"
          style={{
            backgroundColor: "#2563eb",
            fontSize: "15px",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb")
          }
        >
          Update Live Score
        </button>
      </div>
    </div>
  );
}
