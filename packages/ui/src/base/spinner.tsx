export function Spinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="size-6 rounded-full border-8 border-gray-200 dark:border-zinc-700"></div>
        <div className="animate-spin-fast absolute left-0 top-0 size-6 rounded-full border-t-8 border-emerald-600"></div>
      </div>
    </div>
  );
}
