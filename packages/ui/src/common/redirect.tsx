import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { UrlObject } from 'url';

// Just a simple component to redirect to another page
export default function Redirect({ to }: { to: UrlObject | string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
