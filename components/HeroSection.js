import Image from "next/image";
import heroSection from "../public/heroSection.svg"; // Replace with your image path
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative w-full h-[36rem] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroSection}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 ease-in-out transform scale-110 hover:scale-125" // Zoom effect
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent opacity-60" />
      </div>
      <div className="absolute flex gap-10 flex-col items-center justify-center w-full h-full bg-yellow-200 bg-opacity-30">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 underline-offset-[1rem] hover:underline">
          Welcome to Our Surfing Website
        </h1>
        <Link
          href="#"
          className="text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-yellow-600 transition-transform duration-500 ease-in-out transform scale-110 hover:scale-125"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
