import Footer from "@/components/Footer/Footer";
import HomeNavbar from "@/components/HomeNavbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <HomeNavbar />
      <main className="mx-auto max-w-7xl">{children}</main>
      <Footer />
    </section>
  );
}
