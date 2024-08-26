import clsx from 'clsx';
import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  position?:
    | 'top center'
    | 'top right'
    | 'top left'
    | 'bottom center'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center';
  children: ReactNode;
}

export default function Tooltip({
  content,
  position = 'bottom center',
  children,
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex cursor-pointer items-center"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          className={clsx(
            'absolute text-sm',
            position.includes('top') && 'top-full mb-2',
            position.includes('bottom') && 'bottom-full mb-2',
            position.includes('center') && 'left-1/2 -translate-x-1/2',
            position.includes('right') && 'right-1',
            position.includes('left') && 'left-0',
            'bg-gray-800 text-white dark:bg-gray-200 dark:text-black',
            'pointer-events-none z-50 rounded-md px-2 py-1 transition-all duration-300'
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
