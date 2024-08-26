import clsx from 'clsx';
import { Link } from './link';
import { UrlObject } from 'url';

export function Card({
  className,
  children,
  href,
  onClick = () => {
    // No-op
  },
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  href?: (UrlObject & string) | string | undefined;
  onClick?: () => void;
}) {
  const cardClasses = clsx(
    'overflow-hidden rounded-xl bg-white ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10',
    href &&
      'cursor-pointer shadow-md transition-shadow hover:shadow-lg hover:ring-zinc-950/20 dark:hover:ring-white/20',
    className
  );
  if (href) {
    return (
      <Link className={cardClasses} href={href} {...props}>
        {children}
      </Link>
    );
  } else {
    return (
      <div className={cardClasses} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }
}

export function CardHeader({ className, ...props }: { className?: string }) {
  return <div className={clsx('p-6', className)} {...props} />;
}

export function CardBody({ className, ...props }: { className?: string }) {
  return <div className={clsx('px-6 py-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: { className?: string }) {
  return <div className={clsx('px-6 py-4', className)} {...props} />;
}

export function CardDivider({ className, ...props }: { className?: string }) {
  return (
    <hr
      className={clsx(
        'border-t border-zinc-200 dark:border-zinc-700',
        className
      )}
      {...props}
    />
  );
}

export function CardLink({
  isExternal,
  showAnchorIcon,
  href,
  className,
  children,
  ...props
}: {
  isExternal?: boolean;
  showAnchorIcon?: boolean;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = clsx(
    'text-blue-600 hover:underline dark:text-blue-400',
    className
  );

  const content = (
    <>
      {children}
      {showAnchorIcon && (
        <svg
          className="ml-1 inline-block size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </>
  );

  return (
    <Link
      className={classes}
      href={href}
      target={isExternal ? '_blank' : '_self'}
      {...props}
    >
      {content}
    </Link>
  );
}

export function CardImage({
  alt,
  height,
  width,
  radius,
  src,
  className,
  ...props
}: {
  alt: string;
  height: number;
  width: number;
  radius: 'sm' | 'md' | 'lg' | 'full';
  src: string;
  className?: string;
}) {
  const classes = clsx(
    {
      'rounded-sm': radius === 'sm',
      'rounded-md': radius === 'md',
      'rounded-lg': radius === 'lg',
      'rounded-full': radius === 'full',
    },
    className
  );

  return (
    <img
      alt={alt}
      height={height}
      width={width}
      src={src}
      className={classes}
      {...props}
    />
  );
}
