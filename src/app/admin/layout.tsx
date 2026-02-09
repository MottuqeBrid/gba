"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "./_Admin_component/AdminNavbar/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Only show navbar on sub-pages, not on main dashboard
  const isMainDashboard = pathname === "/admin";

  return (
    <section className="w-full min-h-screen bg-base-100">
      {!isMainDashboard && <AdminNavbar />}
      <main className={isMainDashboard ? "" : "mx-auto max-w-7xl"}>
        {children}
      </main>
    </section>
  );
}
