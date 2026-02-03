import Carousel from "@/components/Carousel/Carousel";
import HomeNavbar from "../components/HomeNavbar/Navbar";
import UpcomingEvents from "@/components/UpcomingEvents/UpcomingEvents";
import MessagesSection from "@/components/MessagesSection/MessagesSection";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <main className="mx-auto max-w-7xl">
        <HomeNavbar />
        <Carousel />
        <UpcomingEvents />
        <MessagesSection />
        <Footer />
      </main>
    </div>
  );
}
