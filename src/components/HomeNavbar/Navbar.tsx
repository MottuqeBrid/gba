"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";
import ThemeToggle from "../ThemeTogle/ThemeTogle";
import {
  FaHome,
  FaCalendarAlt,
  FaImages,
  FaUsers,
  FaInfoCircle,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/events", label: "Events", icon: <FaCalendarAlt /> },
  { href: "/gallery", label: "Gallery", icon: <FaImages /> },
  { href: "/members", label: "Members", icon: <FaUsers /> },
  { href: "/about", label: "About", icon: <FaInfoCircle /> },
  // { href: "/admin", label: "Admin", icon: <FaUserShield /> },
];

import useAuth from "@/app/hooks/useAuth";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="bg-base-100/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-base-200">
      <div className="navbar max-w-7xl mx-auto px-4 lg:px-6 h-20">
        {/* Navbar Start: Mobile Menu + Branding */}
        <div className="navbar-start gap-4">
          <div
            className={`dropdown lg:hidden ${isOpen ? "dropdown-open" : ""}`}
          >
            <button
              className="btn btn-ghost btn-circle lg:hidden text-primary"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
            <ul
              className={`menu menu-sm dropdown-content mt-3 z-50 p-4 shadow-2xl bg-base-100 rounded-2xl w-64 gap-2 border border-base-200 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              <div className="mb-4 px-2"></div>
              {navItems.map((item) => (
                <li key={item.href} onClick={() => setIsOpen(false)}>
                  <NavLink
                    href={item.href}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 text-base font-medium"
                    activeClassName="bg-primary text-primary-content font-bold shadow-lg shadow-primary/20"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 group">
            <Logo
              href="/"
              size="md"
              className="group-hover:rotate-12 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Navbar Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-2 bg-base-200/50 p-1.5 rounded-full border border-base-300">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-base-100 hover:text-primary hover:shadow-sm transition-all duration-300 active:scale-95"
                  activeClassName="bg-primary text-primary-content shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End: User Actions */}
        <div className="navbar-end gap-2 sm:gap-4">
          <ThemeToggle variant="button" size="md" />

          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-all duration-300"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt={user.fullName}
                    src={
                      user.photo ||
                      `https://ui-avatars.com/api/?name=${user.fullName}&background=random`
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-50 p-3 shadow-2xl bg-base-100 rounded-2xl w-52 gap-1 border border-base-200"
              >
                <li className="px-4 py-3 border-b border-base-200 mb-2">
                  <p className="font-bold text-primary truncate max-w-full">
                    {user.fullName}
                  </p>
                  <p className="text-xs opacity-60 truncate max-w-full">
                    {user.email}
                  </p>
                </li>
                <li>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <FaUserShield className="text-primary" />
                    {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors w-full text-left"
                  >
                    <FaTimes />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm sm:btn-md rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
            >
              <span className="hidden sm:inline">Join Us</span>
              <FaUsers className="sm:hidden" size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
