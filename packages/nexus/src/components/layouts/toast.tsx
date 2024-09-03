import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import React from 'react';

export default function ToastContainer() {
  /**
   * ----------------------------------------------------------------------------------------------
   * Setup
   * ----------------------------------------------------------------------------------------------
   * */
  const { resolvedTheme } = useTheme();
  const [themeModeStyles, setThemeModeStyles] = useState({});

  /**
   * ----------------------------------------------------------------------------------------------
   * useEffect (Mainly dealing with dark mode toggling)
   * ----------------------------------------------------------------------------------------------
   * */
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setThemeModeStyles({
        background: '#2a2a2b',
        border: '1px solid #414142',
        boxShadow:
          '0 3px 10px rgba(0, 0, 0, 0.20), 0 3px 3px rgba(0, 0, 0, 0.15)',
        color: '#e1e2e3',
      });
    } else {
      setThemeModeStyles({
        border: '1px solid #e3e3e4',
        boxShadow:
          '0 3px 10px rgba(0, 0, 0, 0.05), 0 3px 3px rgba(0, 0, 0, 0.05)',
      });
    }
  }, [resolvedTheme]);

  /**
   * ----------------------------------------------------------------------------------------------
   * Render
   * ----------------------------------------------------------------------------------------------
   * */
  return (
    <>
      {/* Toaster component for displaying toasts */}
      {/* @ts-expect-error: Unable to fix this TS error, leave it as is for now */}
      <Toaster position="bottom-right" reverseOrder={false}>
        {/* Render each toast */}
        {(t) => (
          // @ts-expect-error: Unable to fix this TS error, leave it as is for now
          <ToastBar
            toast={t} // Pass the toast object to ToastBar
            style={{
              ...t.style, // Apply default styles
              ...themeModeStyles, // Apply theme specific styles
              alignItems: 'start', // Align items to the start
              // animation: t.visible ? "slideOutTop 0.5s" : "slideOutTop 0.5s",
            }}
          >
            {/* Render the content of the toast */}
            {({ icon, message }) => (
              <>
                {/* Display the icon */}
                <div className="mt-1">{icon}</div>
                {/* Display the message */}
                <div className="text-sm">{message}</div>
                {/* Display a close button for dismissing the toast if the toast is not loading */}
                {t.type !== 'loading' && (
                  <div style={{ marginTop: '3px' }}>
                    <button
                      className="m-0 p-0 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
                      style={{ width: '24px', height: '24px' }}
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <MdClose />
                    </button>
                  </div>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}
