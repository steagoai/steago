import clsx from 'clsx';

/**
 * Component for displaying a full-page spinner with an optional text.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {boolean} [props.hideText=true] - Whether to hide the text or not (default: true).
 * @param {string} [props.textLogoPath] - The path to the text logo image (default: null).
 * @returns {JSX.Element} - The rendered component.
 */
const FullPageSpinner = ({ hideText = true, textLogoPath = null } = {}) => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 pt-20 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        {/* The svg text-logo container. Hidden if hideText is true */}
        {textLogoPath && (
          <div
            className={clsx(
              'steago-logo-slider relative text-4xl font-semibold text-emerald-700',
              hideText === true && 'hidden'
            )}
          >
            <img
              src={textLogoPath}
              alt=""
              className="dark:opacity-75 dark:grayscale"
            />
          </div>
        )}
        <div className="relative">
          <div className="size-6 rounded-full border-8 border-gray-200 dark:border-zinc-700"></div>
          <div className="animate-spin-fast absolute left-0 top-0 size-6 rounded-full border-t-8 border-emerald-600"></div>
        </div>
      </div>
    </div>
  );
};

export default FullPageSpinner;
