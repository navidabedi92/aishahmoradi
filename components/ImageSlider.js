import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageSlider({ imageData, eventName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for the current image index
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageData.length); // Cycle through images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array to run only once
  return (
    <>
      <div className="relative mb-4">
        {imageData.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={eventName}
            className={`w-full h-56 object-cover rounded-lg transition-opacity duration-500 ${
              currentImageIndex === index
                ? "opacity-100"
                : "opacity-0 absolute left-[100000rem]"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        {imageData.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              currentImageIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </>
  );
}
