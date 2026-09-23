import { GraduationCap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white font-display">PlaceMe</span>
              <span className="text-xs text-surface-500 ml-2">Placement Portal</span>
            </div>
          </div>

          {/* Center text */}
          <p className="text-xs text-surface-500 text-center">
            Connecting students with top companies. Your career starts here.
          </p>

          {/* Made with */}
          <p className="text-xs text-surface-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for students
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-surface-800 text-center">
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} College Placement Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
