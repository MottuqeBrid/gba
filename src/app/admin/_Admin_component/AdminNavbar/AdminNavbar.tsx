"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../../components/Logo/Logo";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaPhotoVideo,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminLinks: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <FaTachometerAlt size={16} /> },
  { href: "/admin/events", label: "Events", icon: <FaCalendarAlt size={16} /> },
  { href: "/admin/members", label: "Members", icon: <FaUsers size={16} /> },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: <FaPhotoVideo size={16} />,
  },
  { href: "/admin/settings", label: "Settings", icon: <FaCog size={16} /> },
];

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-base-100/95 backdrop-blur-md border-b border-base-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Logo href="/admin" size="sm" />
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary text-primary-content shadow-md"
                    : "text-base-content/70 hover:text-primary hover:bg-base-200"
                }`}
              >
                <span
                  className={
                    isActive(link.href)
                      ? "text-primary-content"
                      : "text-primary"
                  }
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* View Site Button */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 btn btn-ghost btn-sm"
            >
              <FaHome size={16} />
              <span className="hidden md:inline">View Site</span>
            </Link>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span className="text-sm font-bold">A</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-1 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
              >
                <li className="menu-title">
                  <span className="text-primary font-semibold">
                    Administrator
                  </span>
                </li>
                <li>
                  <Link href="/" className="gap-2">
                    <FaHome size={14} /> View Site
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" className="gap-2">
                    <FaCog size={14} /> Settings
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link href="/" className="text-error hover:bg-error/10 gap-2">
                    <FaSignOutAlt size={14} /> Logout
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden btn btn-ghost btn-sm btn-square"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <nav className="pt-2 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                <span
                  className={
                    isActive(link.href)
                      ? "text-primary-content"
                      : "text-primary"
                  }
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
            <div className="divider my-2"></div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-base-content/70 hover:bg-base-200"
            >
              <FaHome size={16} className="text-info" />
              View Site
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10"
            >
              <FaSignOutAlt size={16} />
              Logout
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
