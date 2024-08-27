import platform from 'platform';
import ky, { KyInstance } from 'ky';
import { usePlatformStore } from './store';
import { getNavigatorLanguage } from './browser';

// --------------------------------------------------------------------------------------

export let createPlatformPlainClient: () => Promise<KyInstance>;
export let createPlatformAuthClient: (
  workspaceUUID: string | null
) => Promise<KyInstance>;

export function initializeClients({
  withDefaults = false,
  createPlainClientFn = null,
  createAuthClientFn = null,
}: {
  withDefaults?: boolean;
  createPlainClientFn?: null | (() => Promise<KyInstance>);
  createAuthClientFn?:
    | null
    | ((workspaceUUID: string | null) => Promise<KyInstance>);
}) {
  if (!!createPlatformPlainClient && !!createPlatformAuthClient) {
    // Already initialized
    return;
  }
  if (withDefaults) {
    // console.log('Initializing clients with default functions');
    createPlatformPlainClient = createDefaultPlatformPlainClient;
    createPlatformAuthClient = createDefaultPlatformAuthClient;
  } else {
    if (createPlainClientFn === null || createAuthClientFn === null) {
      throw new Error(
        'createPlainClientFn and createAuthClientFn cannot be null'
      );
    }
    // console.log('Initializing clients with given functions');
    createPlatformPlainClient = createPlainClientFn;
    createPlatformAuthClient = createAuthClientFn;
  }
}

// --------------------------------------------------------------------------------------

/**
 * Retrieves the analytics context string.
 *
 * @return {string} The analytics context string.
 */
const getAnalyticsContextString = (): string => {
  // Define the analytics context object.
  const analyticsContext = {
    // Define the page object.
    page: {
      // Retrieve the current path.
      path: window.location.pathname,
      // Retrieve the referrer.
      referrer: document.referrer,
      // Retrieve the search parameters.
      search: window.location.search,
      // Retrieve the title of the page.
      title: document.title || '',
      // Retrieve the full URL.
      url: window.location.href,
    },
    // Retrieve the user agent string.
    userAgent: navigator.userAgent,
    // Retrieve the locale of the user.
    locale: getNavigatorLanguage(),
    // Define the OS object.
    os: {
      // Retrieve the name of the operating system.
      name: platform?.os?.family || 'unknown',
      // Retrieve the version of the operating system.
      version: platform?.os?.version || 'unknown',
    },
    // Additional context could be added here.
    // ..._ipContext,
  };

  // Convert the analytics context object to a JSON string.
  return JSON.stringify(analyticsContext);
};

// --------------------------------------------------------------------------------------

/**
 * Creates a plain ky client with the base URL and analytics context hook.
 *
 * @return {Promise<KyInstance>} A promise that resolves to a ky client.
 * @throws {Error} If NEXT_PUBLIC_PLATFORM_API_BASE_URL is not defined.
 */
export const createDefaultPlatformPlainClient =
  async (): Promise<KyInstance> => {
    const baseUrl = process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL;

    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_PLATFORM_API_BASE_URL is not defined');
    }

    /**
     * Hook to set the analytics context header before each request.
     *
     * @param {Request} request - The ky request object.
     */
    const setAnalyticsContextHook = (request: Request) => {
      request.headers.set('C-Browser-Context', getAnalyticsContextString());
    };

    try {
      const client = ky.create({
        prefixUrl: baseUrl,
        hooks: {
          beforeRequest: [setAnalyticsContextHook],
        },
      });
      return client;
    } catch (error) {
      console.error('Failed to create ky client:', error);
      throw error;
    }
  };

// --------------------------------------------------------------------------------------

/**
 * Creates a ky client with authentication headers for a specific workspace.
 *
 * @param {string} workspaceUUID - The UUID of the workspace.
 * @return {Promise<KyInstance>} A promise that resolves to a ky client.
 * @throws {Error} If the access token or refresh token is missing.
 */
export const createDefaultPlatformAuthClient = async (
  workspaceUUID: string | null // Do not remove this parameter
): Promise<KyInstance> => {
  // Extend the plain client with authentication hooks
  return (await createDefaultPlatformPlainClient()).extend({
    hooks: {
      /**
       * Hook to set the authorization header before each request.
       *
       * @param {Request} request - The ky request object.
       */
      beforeRequest: [
        (request) => {
          // Get access token
          // NOTE: We're using getState to get frozen state-- no react magic here so beware!
          const accessToken = usePlatformStore.getState().accessToken;
          if (!accessToken) {
            throw new Error(`Missing tokens for workspace`);
          }
          // Set the authorization header with the access token for the workspace
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        },
      ],
    },
  });
};

// --------------------------------------------------------------------------------------
