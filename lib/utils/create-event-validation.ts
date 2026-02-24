export interface CreateEventData {
  eventName: string;
  eventType: "single" | "multi";
  selectedSports: string[];
  location: string;
  startDate: string;
  endDate: string;
  quota: string;
  eventLogo: File | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate create event form data
 */
export function validateCreateEventData(data: CreateEventData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.eventName.trim()) {
    errors.eventName = "Event name is required";
  }

  // Single event: max 1 sport
  if (data.eventType === "single" && data.selectedSports.length > 1) {
    errors.sports = "Single event can only have 1 sport category";
  }
  // Multi event: min 1 sport
  if (data.eventType === "multi" && data.selectedSports.length < 1) {
    errors.sports = "Multi event must have at least 1 sport category";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required";
  }

  if (!data.quota || parseInt(data.quota) < 1) {
    errors.quota = "Max participants must be at least 1";
  }

  if (!data.eventLogo) {
    errors.logo = "Event logo is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Remove a specific error key from errors object
 */
export function clearError(errors: Record<string, string>, key: string): Record<string, string> {
  const { [key]: _, ...rest } = errors;
  return rest;
}
