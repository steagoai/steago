import * as Headless from '@headlessui/react';
import NextLink, { type LinkProps } from 'next/link';
import React, { forwardRef } from 'react';

// Use Omit to avoid conflicting href types between NextLink and anchor tag props
export const Link = forwardRef(function Link(
  props: Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & LinkProps, // Omit href from 'a' tag props
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  );
});
