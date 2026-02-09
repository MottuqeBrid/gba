import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export const metadata: Metadata = {
  title: "GBA-Greater Bogura Association",
  description: "Greater Bogura Association",
  icons: {
    icon: "/logo.jpg",
  },
  keywords: [
    "GBA",
    "Greater Bogura Association",
    "Bogura",
    "Association",
    "Bogura Association",
    "GBA Bogura",
    "GBA Association",
    "GBA Bogura Association",
    "KU",
    "KU GBA",
    "KU Bogura",
    "KU Bogura Association",
    "KU GBA Bogura",
    "KU GBA Association",
    "KU GBA Bogura Association",
    "Khulna University",
    "Khulna University Bogura",
    "Khulna University Bogura Association",
    "Khulna University GBA",
    "Khulna University GBA Bogura",
    "Khulna University GBA Association",
    "Khulna University GBA Bogura Association",
  ],
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${raleway.variable}  antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
