export default function Skeleton({ className = 'h-5 w-full rounded' }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`} />;
}
