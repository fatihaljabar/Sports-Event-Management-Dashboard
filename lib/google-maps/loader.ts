/**
 * Google Maps Script Loader
 *
 * Uses module-level state instead of global variables to avoid Fast Refresh issues.
 * Properly cleans up callbacks after use.
 */

type LoadCallback = () => void;

interface LoaderState {
  isLoaded: boolean;
  isLoading: boolean;
  callbacks: Set<LoadCallback>;
}

// Module-level state (persists across Fast Refresh but is module-scoped)
const loaderState: LoaderState = {
  isLoaded: false,
  isLoading: false,
  callbacks: new Set(),
};

/**
 * Check if Google Maps API is available in the window object
 */
function isGoogleMapsAvailable(): boolean {
  return typeof window !== "undefined" &&
    !!(window.google?.maps?.places);
}

/**
 * Initialize the global callback for Google Maps script loading
 */
function initializeCallback(): void {
  if (typeof window === "undefined") return;

  // Only set the callback if it doesn't exist
  if (!window.initGooglePlacesAutocomplete) {
    window.initGooglePlacesAutocomplete = () => {
      loaderState.isLoaded = true;
      loaderState.isLoading = false;

      // Execute all pending callbacks
      for (const callback of loaderState.callbacks) {
        callback();
      }

      // Clear callbacks after execution
      loaderState.callbacks.clear();

      // Clean up the global callback
      delete window.initGooglePlacesAutocomplete;
    };
  }
}

/**
 * Load the Google Places JavaScript API script
 *
 * @param callback - Function to call when script is loaded
 * @returns Cleanup function to cancel the callback if component unmounts
 */
export function loadGoogleMapsScript(callback: LoadCallback): () => void {
  // If already loaded, execute callback immediately
  if (loaderState.isLoaded || isGoogleMapsAvailable()) {
    callback();
    return () => {}; // No cleanup needed
  }

  // If currently loading, add callback to queue
  if (loaderState.isLoading) {
    loaderState.callbacks.add(callback);
    return () => {
      loaderState.callbacks.delete(callback);
    };
  }

  // Start loading
  loaderState.isLoading = true;
  loaderState.callbacks.add(callback);

  initializeCallback();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!apiKey) {
    console.warn("[GoogleMaps] API key not found");
    loaderState.isLoading = false;
    loaderState.callbacks.clear();
    return () => {};
  }

  // Create and append script tag
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlacesAutocomplete`;
  script.async = true;
  script.defer = true;

  script.onerror = () => {
    console.error("[GoogleMaps] Failed to load script");
    loaderState.isLoading = false;
    loaderState.callbacks.clear();
  };

  document.head.appendChild(script);

  // Return cleanup function
  return () => {
    loaderState.callbacks.delete(callback);
  };
}

/**
 * Check if Google Maps is loaded (synchronous check)
 */
export function isGoogleMapsLoaded(): boolean {
  return loaderState.isLoaded || isGoogleMapsAvailable();
}

/**
 * Get the Google Maps namespace from window object
 */
export function getGoogleMaps(): any {
  return window.google?.maps;
}
