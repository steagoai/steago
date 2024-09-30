import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from '../../base/alert';
import { Button } from '../../base/button';
import Link from 'next/link';

export default function FullPageAlert({
  workspaceName = undefined,
  userEmail = undefined,
  alertLabel = 'Error loading this page.',
  alertDescription = 'There was an error loading this page. Please try again.',
  nextActionLink = '/',
  nextActionLabel = 'Back to home',
} = {}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Alert open={true} onClose={() => {}}>
      <AlertTitle className="mb-5 flex justify-center border-b border-zinc-200 pb-4 dark:border-zinc-700">
        <div>
          <div className="mb-2 flex  flex-row items-center justify-center text-base text-emerald-700 dark:text-emerald-300/75">
            <img
              src={process.env.NEXT_PUBLIC_APP_LOGO_URL ?? '/images/logo.png'}
              alt="Logo"
              className="size-6"
            />
            {process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}
          </div>
          {alertLabel}
        </div>
      </AlertTitle>
      <AlertDescription>
        <div className="text-center">{alertDescription}</div>
        {!!workspaceName && !!userEmail && (
          <div className="mt-2 text-center text-xs opacity-75">
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
      </AlertDescription>
      <AlertActions className="mt-5 flex-row justify-center border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <Link href={nextActionLink}>
          <Button color="light">{nextActionLabel}</Button>
        </Link>
      </AlertActions>
    </Alert>
  );
}
