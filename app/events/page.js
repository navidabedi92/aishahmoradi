import DetailEvents from "@/components/DetailEvents";
import { FetchOrganizationEvents } from "@/utils/Common";
import Image from "next/image";
import image1 from "../../public/images/image1.jpg";
import image2 from "../../public/images/image2.jpg";
import image3 from "../../public/images/image3.jpg";
import image4 from "../../public/images/image4.jpg";
import image5 from "../../public/images/image5.jpg";
import image6 from "../../public/images/image6.jpg";

import Link from "next/link";

const randomImages = [image1, image2, image3, image4, image5, image6];
const Events = async () => {
  let events = [];
  let imageIndex = 0;
  try {
    const response = await FetchOrganizationEvents(-1); // Fetch all events
    if (response.data.IsSuccessfull) {
      events = response.data.Data; // Access the events directly from the response
    } else {
      console.error("Failed to fetch events:", response);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          // Select a random image for each event

          const randomImage = randomImages[imageIndex];
          imageIndex = (imageIndex + 1) % randomImages.length;
          return (
            <Link href={`/events/${event.ID}`}>
              <div
                key={event.ID}
                className="border rounded-lg overflow-hidden shadow-lg cursor-pointer"
              >
                <Image
                  src={randomImage}
                  alt={event.Name}
                  height={"12rem"}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.Name}</h3>
                  <p>
                    Start Date: {new Date(event.StartDate).toLocaleDateString()}
                  </p>
                  <p>
                    End Date: {new Date(event.EndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
