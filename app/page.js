import EventSlider from "@/components/EventSlider";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <div className="bg-gray-800">
        <section>
          <HeroSection />
        </section>
        <section className="p-4 md:p-8 lg:p-12">
          <EventSlider />
        </section>
      </div>
    </>
  );
}
