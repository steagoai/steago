// Styles
import '@/styles/globals.scss';
import '@steago/ui/styles/globals.scss';
import '@steago/ui/styles/tiptap.scss';
// Packages
import { initializeClients } from '@steago/nexus/utils/client';
import { usePlatformStore } from '@steago/nexus/utils/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function SteagoApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient();
  const { cleanUpStaleNewThreads } = usePlatformStore();

  useEffect(() => {
    // Initialize API clients
    initializeClients({ withDefaults: true });
    // Clean up stale new threads older than 30 days
    cleanUpStaleNewThreads(60 * 60 * 24 * 30);
  }, [cleanUpStaleNewThreads]);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
