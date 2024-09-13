import Link from 'next/link';
import { RxSlash } from 'react-icons/rx';
import React, { useEffect } from 'react';
import { Button } from '../../base/button';

export interface FullPageCardProps {
  workspaceName?: string;
  userEmail?: string;
  alertMiniTitle?: string;
  alertLabel?: string;
  alertDescription?: string;
  nextActionLabel?: string;
  nextActionLink?: string | null;
  nextActionOnClick?: () => void;
  onLoad?: () => void;
}

export default function FullPageCard({
  workspaceName = undefined,
  userEmail = undefined,
  alertMiniTitle = 'Error',
  alertLabel = 'Error loading this page',
  alertDescription = 'There was an error loading this page. Please try again.',
  nextActionLabel = 'Back to home',
  nextActionLink = null,
  nextActionOnClick = undefined,
  onLoad = () => {
    // No-op
  },
}: FullPageCardProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 pt-20 sm:px-6 lg:px-8">
      <div className="flex justify-center sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="me-4 h-9 w-auto rounded-lg"
          src="/images/steago-logo-dark.png"
          alt="Steago Logo"
        />
        <h2 className="my-auto me-2 flex items-center gap-1 text-center text-xl font-medium leading-9 tracking-tight text-zinc-900 dark:text-zinc-100">
          <span>Steago Cloud</span>
          <span className="text-2xl text-zinc-400 dark:text-zinc-500">
            <RxSlash />
          </span>
          <span>{alertMiniTitle}</span>
        </h2>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[400px] sm:max-w-[360px]">
        <div className="mx-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-950/5 sm:mx-0 sm:px-6 dark:bg-zinc-900 dark:ring-white/20">
          <div className="mb-5 border-b border-zinc-200 pb-4 text-center text-lg font-semibold dark:border-zinc-700">
            {alertLabel}
          </div>
          <div>
            <div className="text-center">{alertDescription}</div>
            {!!workspaceName && !!userEmail && (
              <div className="mt-4 text-center text-xs opacity-75">
                <div>
                  Signed into workspace{' '}
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300/75">
                    {workspaceName}
                  </span>{' '}
                  as{' '}
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300/75">
                    {userEmail}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* If either link or click handler defined, then render */}
          {(!!nextActionLink || !!nextActionOnClick) && (
            <div className="mt-5 flex flex-row justify-center border-t border-zinc-200 pt-4 dark:border-zinc-700">
              {!!nextActionOnClick && (
                <Button color="light" onClick={nextActionOnClick}>
                  {nextActionLabel}
                </Button>
              )}
              {!!nextActionLink && (
                <Link href={nextActionLink}>
                  <Button color="light">{nextActionLabel}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
