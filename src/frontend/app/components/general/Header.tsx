import { Link } from "@remix-run/react";
import meta from "~/meta";

export function Header() {
  return (
    <header className="bg-gray-50 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Header Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              {meta.name}
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
