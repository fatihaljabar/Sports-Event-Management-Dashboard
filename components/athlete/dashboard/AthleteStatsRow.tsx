import { ATHLETE_STATS } from "../constants";

export function AthleteStatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ATHLETE_STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          style={{
            borderColor: "#f3f4f6",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div className="flex items-start justify-between p-5">
            <div>
              <p
                className="text-gray-500"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span
                  className="text-gray-900"
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontSize: "32px",
                    fontWeight: 700,
                  }}
                >
                  {stat.value}
                </span>
                {stat.capacity && (
                  <span
                    className="text-gray-400"
                    style={{ fontSize: "14px", fontWeight: 500 }}
                  >
                    {stat.capacity}
                  </span>
                )}
              </div>
            </div>
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
          </div>

          {stat.percent !== null ? (
            <div className="px-5 pb-5">
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "#f3f4f6" }}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stat.barColor}`}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
              <p
                className="text-gray-400 mt-1.5"
                style={{ fontSize: "11px" }}
              >
                {stat.percent}% capacity filled
              </p>
            </div>
          ) : (
            <div className="px-5 pb-5 flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#fb923c" }}
              />
              <span
                style={{ fontSize: "12px", fontWeight: 500, color: "#ea580c" }}
              >
                Requires attention
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
