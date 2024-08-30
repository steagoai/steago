import useCurrentUser from '@/utils/hooks/currentUser';
import AppLayout, {
  SidebarItemProps,
} from '@steago/nexus/components/layouts/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Type for the props object of the `PlatformAppLayout` component
 */
export type PlatformAppLayoutProps = {
  children: React.ReactNode;
  mobileTitle?: string;
  zeroPadding?: boolean;
  noOverflow?: boolean;
  sidebarItems?: SidebarItemProps[];
};

export default function PlatformAppLayout({
  children,
  ...props
}: PlatformAppLayoutProps): React.ReactElement {
  const currentUser = useCurrentUser();

  const router = useRouter();

  useEffect(() => {
    if (
      !!router.query.workspaceCode &&
      router.query.workspaceCode !== 'workspace'
    ) {
      // Get the current path
      const { pathname, query } = router;

      // Replace the workspaceCode in the pathname
      const newPathname = pathname.replace(/\/[^/]+\//, `/workspace/`);

      // Clear the workspaceCode query parameter if it exists
      const { workspaceCode, ...remainingQuery } = query;

      // Navigate to the new URL
      router.push({
        pathname: newPathname,
        query: remainingQuery,
      });
    }
  }, [router]);

  return (
    <AppLayout currentUser={currentUser} {...props}>
      {children}
    </AppLayout>
  );
}
