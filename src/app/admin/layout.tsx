import AdminNavbar from "./_Admin_component/AdminNavbar/AdminNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl">{children}</main>
    </section>
  );
}
