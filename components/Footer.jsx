import { GraduationCap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-surface-600 text-sm">
            <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium font-display text-surface-900">
              College Placement Portal
            </span>
          </div>

          <p className="text-xs text-surface-500 text-center sm:text-right flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for Students & Training & Placement Cell
          </p>
        </div>
      </div>
    </footer>
  );
}
