/**
 * Location Picker Type Definitions
 */

export interface LocationPickerProps {
  value: string;
  onChange: (value: string, timezone?: string, coordinates?: Coordinates) => void;
  initialCoordinates?: Coordinates | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  name: string;
}

// Google Places Autocomplete types
export interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface GooglePlaceResult {
  name: string;
  types: string[];
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location?: {
      lat(): number;
      lng(): number;
    };
  };
  place_id?: string;
}

// Global Window augmentation for Google Maps
declare global {
  interface Window {
    initGooglePlacesAutocomplete?: () => void;
    google?: any;
  }
}
