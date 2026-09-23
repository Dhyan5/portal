import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface-200 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-accent-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-4 text-sm text-surface-500 font-medium">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 skeleton" />
          <div className="h-4 w-1/2 skeleton" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-2/3 skeleton" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 skeleton rounded-full" />
        <div className="h-8 w-16 skeleton rounded-full" />
      </div>
    </div>
  );
}
