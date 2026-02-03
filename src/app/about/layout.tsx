import HomeNavbar from "@/components/HomeNavbar/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full">
      <HomeNavbar />
      <main className="mx-auto max-w-7xl">{children}</main>
    </div>
  );
}
