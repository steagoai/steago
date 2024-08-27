/**
 * Checks if the current window is in standalone mode.
 *
 * This function uses the `window.matchMedia` API to determine if the display mode
 * is set to standalone. If the `window.matchMedia` API is not supported, it falls
 * back to checking the `navigator.standalone` property, which is specific to iOS
 * Safari.
 *
 * @returns {boolean} True if the window is in standalone mode, false otherwise.
 */
export const isWindowInStandaloneMode = () => {
  if (window.matchMedia) {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  // @ts-expect-error Fallback for iOS Safari
  return window.navigator.standalone === true;
};

// --------------------------------------------------------------------------------------

/**
 * Returns the browser's preferred language.
 *
 * This function first checks if the browser supports the `navigator.languages` property,
 * which returns an array of languages specified by the user. If the array is not empty,
 * it returns the first language in the array.
 *
 * If the browser does not support `navigator.languages`, it checks for the deprecated
 * `navigator.userLanguage` property and falls back to `navigator.language` and
 * `navigator.browserLanguage`. If none of these are available, it returns "en" as the
 * default language.
 *
 * @returns {string} The browser's preferred language.
 */
export function getNavigatorLanguage() {
  // Modern browsers support navigator.languages
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages[0];
  }

  // Fallbacks for older browsers
  const language =
    // @ts-expect-error `userLanguage` and `browserLanguage` are just fallbacks
    navigator.language || navigator.userLanguage || navigator.browserLanguage;

  // Return the found language or default to "en"
  return language || 'en';
}

// --------------------------------------------------------------------------------------
