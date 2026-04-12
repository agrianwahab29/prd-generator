/**
 * Lightweight loading spinner - replaces framer-motion animated dots.
 * Pure CSS animations, zero JS runtime overhead.
 */
export function LoadingSpinner({ text = "Memuat..." }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 bounce-dot bounce-dot-1" />
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 bounce-dot bounce-dot-2" />
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 bounce-dot bounce-dot-3" />
      </div>
      <p className="mt-4 text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );
}
