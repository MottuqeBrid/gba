import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/HomeNavbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      <main className="max-w-7xl mx-auto min-h-screen">{children}</main>
      <Footer />
    </section>
  );
}
