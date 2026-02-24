import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data6m = [
  { month: "Sep '25", events: 8, athletes: 420, keys: 95 },
  { month: "Oct '25", events: 12, athletes: 685, keys: 134 },
  { month: "Nov '25", events: 9, athletes: 510, keys: 108 },
  { month: "Dec '25", events: 6, athletes: 290, keys: 72 },
  { month: "Jan '26", events: 15, athletes: 890, keys: 198 },
  { month: "Feb '26", events: 18, athletes: 1240, keys: 247 },
];

const data3m = [
  { month: "Dec '25", events: 6, athletes: 290, keys: 72 },
  { month: "Jan '26", events: 15, athletes: 890, keys: 198 },
  { month: "Feb '26", events: 18, athletes: 1240, keys: 247 },
];

const data30d = [
  { month: "Week 1", events: 4, athletes: 280, keys: 61 },
  { month: "Week 2", events: 6, athletes: 350, keys: 78 },
  { month: "Week 3", events: 5, athletes: 410, keys: 89 },
  { month: "Week 4", events: 3, athletes: 200, keys: 19 },
];

const periods = ["30 Days", "3 Months", "6 Months"] as const;
type Period = (typeof periods)[number];

const periodData: Record<Period, typeof data6m> = {
  "30 Days": data30d,
  "3 Months": data3m,
  "6 Months": data6m,
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        backgroundColor: "#0F172A",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}
    >
      <p
        style={{
          color: "#94A3B8",
          fontSize: "0.7rem",
          fontFamily: '"JetBrains Mono", monospace',
          marginBottom: "8px",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div
            className="rounded-full"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#CBD5E1",
              fontSize: "0.7rem",
              fontFamily: '"Inter", sans-serif',
              textTransform: "capitalize",
            }}
          >
            {entry.name}
          </span>
          <span
            style={{
              color: "#F8FAFC",
              fontSize: "0.8rem",
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 700,
              marginLeft: "auto",
              paddingLeft: "12px",
            }}
          >
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PerformanceChart() {
  const [activePeriod, setActivePeriod] = useState<Period>("6 Months");
  const chartData = periodData[activePeriod];

  const totalAthletes = chartData.reduce((s, d) => s + d.athletes, 0);
  const totalEvents = chartData.reduce((s, d) => s + d.events, 0);
  const totalKeys = chartData.reduce((s, d) => s + d.keys, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #F1F5F9",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #F8FAFC" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Performance Overview
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.75rem",
                fontFamily: '"Inter", sans-serif',
                marginTop: "1px",
              }}
            >
              Athletes registered, events &amp; keys issued
            </p>
          </div>
          {/* Period Tabs */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
          >
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className="rounded-lg px-3 py-1 transition-all"
                style={{
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: activePeriod === p ? 500 : 400,
                  color: activePeriod === p ? "#2563EB" : "#94A3B8",
                  backgroundColor: activePeriod === p ? "#FFFFFF" : "transparent",
                  boxShadow:
                    activePeriod === p
                      ? "0px 1px 4px rgba(0,0,0,0.08)"
                      : "none",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Mini Stats Row */}
        <div className="flex items-center gap-6 mt-4">
          {[
            { label: "Athletes", value: totalAthletes.toLocaleString(), color: "#2563EB" },
            { label: "Events", value: totalEvents, color: "#F59E0B" },
            { label: "Keys Issued", value: totalKeys, color: "#A78BFA" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{ width: "8px", height: "8px", backgroundColor: stat.color }}
              />
              <span
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#0F172A",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "0.72rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: "#4ADE80" }} strokeWidth={2} />
            <span
              style={{
                color: "#4ADE80",
                fontSize: "0.72rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 500,
              }}
            >
              +18.4% vs prior period
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-5 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="athleteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F5F9"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
              }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              yAxisId="athletes"
              orientation="left"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="events"
              orientation="right"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
                fontFamily: '"JetBrains Mono", monospace',
              }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,99,235,0.04)" }} />

            {/* Athletes Area */}
            <Area
              yAxisId="athletes"
              type="monotone"
              dataKey="athletes"
              name="Athletes"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#athleteGrad)"
              dot={{ fill: "#2563EB", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#2563EB" }}
            />

            {/* Keys Bar */}
            <Bar
              yAxisId="athletes"
              dataKey="keys"
              name="Keys Issued"
              fill="#EDE9FE"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />

            {/* Events Line */}
            <Line
              yAxisId="events"
              type="monotone"
              dataKey="events"
              name="Events"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: "#F59E0B", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#F59E0B" }}
              strokeDasharray="5 3"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-2">
          {[
            { color: "#2563EB", label: "Athletes Registered", solid: true },
            { color: "#A78BFA", label: "Keys Issued", solid: false, bg: "#EDE9FE" },
            { color: "#F59E0B", label: "Events", dashed: true },
          ].map((leg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {leg.dashed ? (
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2].map((s) => (
                    <div
                      key={s}
                      className="rounded-full"
                      style={{ width: "4px", height: "2px", backgroundColor: leg.color }}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-full"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: leg.bg || leg.color,
                    border: leg.bg ? `2px solid ${leg.color}` : undefined,
                  }}
                />
              )}
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "0.7rem",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {leg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}