import Carousel from "@/components/Carousel/Carousel";
import UpcomingEvents from "@/components/UpcomingEvents/UpcomingEvents";
import MessagesSection from "@/components/MessagesSection/MessagesSection";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Carousel />
      <UpcomingEvents />
      <MessagesSection />
    </div>
  );
}
