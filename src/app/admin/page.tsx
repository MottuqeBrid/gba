"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaImages,
  FaComments,
  FaEnvelope,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaPhotoVideo,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import AdminCarouselPage from "./_Admin_component/AdminCarousel/AdminCarousel";
import AdminMessages from "./_Admin_component/AdminMessages/AdminMessages";
import AdminContact from "./_Admin_component/AdminContact/AdminContact";
import AdminAbout from "./_Admin_component/AdminAbout/AdminAbout";
import AdminUsers from "./_Admin_component/AdminUsers/AdminUsers";
import { useAuth } from "@/context/AuthContext";

type TabType = "carousel" | "messages" | "contact" | "about" | "users";

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    id: "users",
    label: "All Users",
    icon: <FaUsers size={18} />,
    component: <AdminUsers />,
  },
  {
    id: "carousel",
    label: "Carousel",
    icon: <FaImages size={18} />,
    component: <AdminCarouselPage />,
  },
  {
    id: "messages",
    label: "Messages",
    icon: <FaComments size={18} />,
    component: <AdminMessages />,
  },
  {
    id: "contact",
    label: "Contact Inbox",
    icon: <FaEnvelope size={18} />,
    component: <AdminContact />,
  },
  {
    id: "about",
    label: "About Settings",
    icon: <FaInfoCircle size={18} />,
    component: <AdminAbout />,
  },
];

const quickLinks = [
  { href: "/admin/events", label: "Events", icon: <FaCalendarAlt size={16} /> },
  { href: "/admin/members", label: "Committee", icon: <FaUsers size={16} /> },
  {
    href: "/admin/users",
    label: "Users List",
    icon: <FaUserShield size={16} />,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: <FaPhotoVideo size={16} />,
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("carousel");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const activeComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <h1 className="text-lg font-bold text-primary">GBA Admin</h1>
          <Link href="/" className="btn btn-ghost btn-sm btn-square">
            <FaHome size={18} />
          </Link>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-64 bg-base-200 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Admin Header */}
          <div className="p-4 lg:p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                  GBA Admin
                </h1>
                <p className="text-xs text-base-content/60 mt-1">Dashboard</p>
              </div>
              <button
                className="lg:hidden btn btn-ghost btn-sm btn-square"
                onClick={closeSidebar}
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="p-3 lg:p-4">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
              Main Menu
            </p>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`flex items-center gap-3 w-full px-3 py-2.5 lg:py-3 rounded-lg transition-all duration-200 text-sm lg:text-base ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-content shadow-md"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      closeSidebar();
                    }}
                  >
                    <span
                      className={
                        activeTab === tab.id
                          ? "text-primary-content"
                          : "text-primary"
                      }
                    >
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav className="p-3 lg:p-4 border-t border-base-300">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
              Quick Links
            </p>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-base-300 transition-colors text-sm"
                    onClick={closeSidebar}
                  >
                    <span className="text-secondary">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-base-300 bg-base-200">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-base-300 transition-colors text-sm"
              >
                <FaHome className="text-info" size={16} />
                <span>View Site</span>
              </Link>
              <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-error/10 text-error transition-colors text-sm">
                <FaSignOutAlt size={16} />
                <button onClick={logout}>Logout</button>
              </div>
            </div>
            <p className="text-[10px] text-base-content/40 text-center mt-3">
              © 2026 GBA
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-14 lg:pt-0">
          {/* Desktop Top Bar */}
          <header className="hidden lg:block sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-base-content/60">
                  Manage your{" "}
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.label.toLowerCase()}{" "}
                  content
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="btn btn-ghost btn-sm gap-2">
                  <FaHome size={16} />
                  View Site
                </Link>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <span className="text-lg font-bold">A</span>
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <span className="font-semibold">Administrator</span>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <Link href="/admin/settings">
                        <FaCog size={14} /> Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => logout()} className="text-error">
                        <FaSignOutAlt size={14} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Current Section Indicator */}
          <div className="lg:hidden px-4 py-3 bg-base-200/50 border-b border-base-200">
            <h2 className="text-lg font-bold">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
          </div>

          {/* Page Content */}
          <div className="p-0">{activeComponent}</div>
        </main>
      </div>
    </div>
  );
}
