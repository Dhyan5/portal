import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 p-6 text-surface-500">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}
