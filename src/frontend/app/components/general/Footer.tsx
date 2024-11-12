import { Link } from "@remix-run/react";
import meta from "~/meta";

export function Footer() {
  return (
    <footer className="bg-gray-50 w-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <a href={"mailto:" + meta.email}>{meta.email}</a>
              </li>
              <li className="text-gray-600">
                <a href={`tel:+${meta.phone}`}>+1 {meta.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8">
          <p className="text-center text-gray-500">
            © {meta.year} {meta.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
