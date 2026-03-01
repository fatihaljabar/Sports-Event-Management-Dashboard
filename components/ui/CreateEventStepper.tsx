"use client";

interface CreateEventStepperProps {
  eventName: string;
  eventType: string;
  selectedSports: string[];
  location: string;
  startDate: string;
  endDate: string;
  eventLogo: unknown | null;
}

export function CreateEventStepper({
  eventName,
  eventType,
  selectedSports,
  location,
  startDate,
  endDate,
  eventLogo,
}: CreateEventStepperProps) {
  // Event Details - check if basic info is filled
  const isEventDetailsComplete = !!eventName && !!eventType && selectedSports.length > 0;

  // Logistics - check if location and dates are filled
  const isLogisticsComplete = !!location && !!startDate && !!endDate;

  // Assets - check if logo is uploaded
  const isAssetsComplete = !!eventLogo;

  const steps = [
    { name: "Event Details", completed: isEventDetailsComplete },
    { name: "Logistics", completed: isLogisticsComplete },
    { name: "Assets", completed: isAssetsComplete },
  ];

  return (
    <div className="hidden sm:flex items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.name} className="flex items-center gap-1.5">
          <div
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: "22px",
              height: "22px",
              backgroundColor: step.completed
                ? "#2563EB"
                : i === 0
                  ? isEventDetailsComplete
                    ? "#2563EB"
                    : "#E2E8F0"
                  : i === 1
                    ? isLogisticsComplete
                      ? "#2563EB"
                      : "#E2E8F0"
                    : isAssetsComplete
                      ? "#2563EB"
                      : "#E2E8F0",
              fontSize: "0.65rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              color: step.completed ? "#fff" : "#94A3B8",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            {step.completed ? "✓" : i + 1}
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              fontFamily: '"Inter", sans-serif',
              color: step.completed ? "#374151" : "#94A3B8",
              fontWeight: step.completed ? 500 : 400,
              transition: "color 0.3s",
            }}
          >
            {step.name}
          </span>
          {i < steps.length - 1 && (
            <div
              style={{
                width: "20px",
                height: "1px",
                backgroundColor:
                  i === 0 && isEventDetailsComplete
                    ? "#2563EB"
                    : i === 1 && isLogisticsComplete
                      ? "#2563EB"
                      : "#E2E8F0",
                transition: "background-color 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
