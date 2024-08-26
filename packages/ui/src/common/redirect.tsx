import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

// Just a simple component to redirect to another page
export default function Redirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
