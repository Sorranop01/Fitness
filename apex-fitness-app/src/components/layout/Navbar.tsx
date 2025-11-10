import { Link } from 'react-router-dom';
import { useUIStore } from '@/store/useUIStore';

export function Navbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              Apex Fitness
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                หน้าหลัก
              </Link>
              <Link
                to="/classes"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                คลาส
              </Link>
              <Link
                to="/check-in"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                เช็คอิน
              </Link>
              <Link
                to="/bookings"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                การจองของฉัน
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Profile Button */}
            <Link
              to="/profile"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
