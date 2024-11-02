"use client";
import React, { useState } from "react";

const eventsData = [
  {
    id: 1,
    title: "Music Festival",
    organizer: "Music Co.",
    location: "Central Park",
    date: "2023-09-15",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Join us for a day of music and fun at Central Park!",
  },
  {
    id: 2,
    title: "Art Exhibition",
    organizer: "Art Society",
    location: "Art Gallery",
    date: "2023-10-01",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Explore the latest art pieces from local artists.",
  },
  {
    id: 3,
    title: "Food Fair",
    organizer: "Foodies United",
    location: "Downtown Square",
    date: "2023-11-10",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Taste delicious food from various cuisines.",
  },
  {
    id: 4,
    title: "Tech Conference",
    organizer: "Tech Innovators",
    location: "Convention Center",
    date: "2023-12-05",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Join us for the latest in technology and innovation.",
  },
  {
    id: 5,
    title: "Film Festival",
    organizer: "Cinema Club",
    location: "City Theater",
    date: "2023-12-20",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Watch the best films from around the world.",
  },
  {
    id: 6,
    title: "Charity Run",
    organizer: "Charity Org",
    location: "City Park",
    date: "2024-01-15",
    image: "https://via.placeholder.com/300x200", // Replace with your image URL
    details: "Participate in a run for a good cause.",
  },
];

export default function EventSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fade, setFade] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  const nextEvent = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % eventsData.length); // Wrap around to the first event
      setFade(false);
    }, 300); // Match this duration with the CSS transition duration
  };

  const prevEvent = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + eventsData.length) % eventsData.length
      ); // Wrap around to the last event
      setFade(false);
    }, 300); // Match this duration with the CSS transition duration
  };

  return (
    <div className="relative p-6  ">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Upcoming Events
      </h2>
      <div className="flex  justify-between items-center">
        <img
          onClick={prevEvent}
          className=" text-white px-4 py-2  hover:cursor-pointer transition duration-300 translate-x-[100%] translate-y-[-100%] md:translate-y-[0] rotate-180"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADdElEQVR4nO2ayWsUQRTGf6JmRhRjxsSIJz1KRP0r1BD3m9tNiRdjiF5dztGTEMjfoYQQRUVQcY0LotGYk8tBjDcnBpWRh1/DQ2cmMz3VPZ2QD5pZXvWrqn5LvfqqYRELFwVgP3AJGAEmgG/ArC77/kYya7MPaCMjyAPHgOvAb6BU5/ULGAOOArlmTGAFcAb47Ab1A7gFnJNlNuuJL9fVpv9Mdh64rXui+z8BA3o4qaAHmHIDeAwcB1pj6FoDnACeOH3vgW4ShD2pYdfhU2BHQP27gGdO/1AS1lmvgVsH34FTwNLQnfBX52mg6KzdGUr5Jpm7pKyzheSxFXirPic1hobQ4RQ+AtpJD23AXfU9Ja+Ihbxzp/vAStLHSuCBc7NYMTPs3MkWu2ZhrfMKSwB1p9gosNOIiVpipqgxWXarebGL1gnLTllBvwv+mlzsrFsn4qbYceBlIwFaBsuA5xqbTaoq8q7saGSxe+HiK+RkuqX341y12VGXIRrBek0i9GSWuEx6uFrDG2pktVOjWAe8kj7LOhsIg17pHK3UoKCy+kfMAjAty7Rpf/Oz0jgPqMObhEUSlrkjfXvKCS9LaPuJ0AhtmYvSNVhOOCLhXpJBSMsckJ6r5YTvJLRdXFIIZZku6TBe4D9MS5h0XRXCMu26/0s54ayELSQPbxlbPOtFzvEEmZmIlR1BJzKdkmt1OteaiOlaHdVca8EE+4iExgBm1RIRDlZLv9GCaOTZvF4Q90tobGFWLfFvibKbCsVYVDQaA5jVorHgisbVlRqNqVOjMbNoCcNJ6bSYrogjamRcbFY3VuPSe2iure4nNdyZwa1uj/R+qOUYYkCNxxsgHx6KkA5NPrzQ2PpquSHvuF4jlLOCAVdo5uplK4oix5qN7cBMXHZnyD0Boy2bhQ6RcjaWK3EU5EULlUQkN4PEXqV4K+kz18jTmHDHCvY7LRSAe+44ruEDn03OtOZm20gnJibVp1XlG0Mp7nRuVhT3aukwNJYpO804d7KtcVDkXQKIdnbdAVdsW+yidSIK7ETP3nc5s0esfW/MtxgKqp2isqMkVwp5WjyndfrFikcDmFV5fUG8U5fSdouutTo0Oqg2dxxPEJUdfc16AyInVnxUW4B6X+H4qSr2ULMmUA6t4mJt13ZNBeNX91KNfX+t7emg2lbcTyyCeY4/F5VOQDaUwpAAAAAASUVORK5CYII="
        ></img>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 w-full bg-white rounded-lg shadow-xl border border-gray-300 transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={eventsData[currentIndex].image}
            alt={eventsData[currentIndex].title}
            className="w-full h-auto rounded-t-lg md:rounded-l-lg md:rounded-tr-none" // Full width on small screens, rounded corners
          />
          <div className="p-4 flex flex-col justify-between w-full">
            <div className="flex-grow flex flex-col items-start justify-center">
              <h3 className="text-lg font-semibold text-center">
                {eventsData[currentIndex].title}
              </h3>
              <p className="text-gray-500 text-center">
                Organizer: {eventsData[currentIndex].organizer}
              </p>
              <p className="text-gray-500 text-center">
                Location: {eventsData[currentIndex].location}
              </p>
              <p className="text-gray-500 text-center">
                Date: {eventsData[currentIndex].date}
              </p>
            </div>
            <button
              onClick={() => handleEventClick(eventsData[currentIndex])}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 self-end"
            >
              Take Part
            </button>
          </div>
        </div>
        <img
          onClick={nextEvent}
          className=" text-white px-4 py-2  hover:cursor-pointer transition duration-300 translate-x-[-100%] translate-y-[-100%] md:translate-y-[0]"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADdElEQVR4nO2ayWsUQRTGf6JmRhRjxsSIJz1KRP0r1BD3m9tNiRdjiF5dztGTEMjfoYQQRUVQcY0LotGYk8tBjDcnBpWRh1/DQ2cmMz3VPZ2QD5pZXvWrqn5LvfqqYRELFwVgP3AJGAEmgG/ArC77/kYya7MPaCMjyAPHgOvAb6BU5/ULGAOOArlmTGAFcAb47Ab1A7gFnJNlNuuJL9fVpv9Mdh64rXui+z8BA3o4qaAHmHIDeAwcB1pj6FoDnACeOH3vgW4ShD2pYdfhU2BHQP27gGdO/1AS1lmvgVsH34FTwNLQnfBX52mg6KzdGUr5Jpm7pKyzheSxFXirPic1hobQ4RQ+AtpJD23AXfU9Ja+Ihbxzp/vAStLHSuCBc7NYMTPs3MkWu2ZhrfMKSwB1p9gosNOIiVpipqgxWXarebGL1gnLTllBvwv+mlzsrFsn4qbYceBlIwFaBsuA5xqbTaoq8q7saGSxe+HiK+RkuqX341y12VGXIRrBek0i9GSWuEx6uFrDG2pktVOjWAe8kj7LOhsIg17pHK3UoKCy+kfMAjAty7Rpf/Oz0jgPqMObhEUSlrkjfXvKCS9LaPuJ0AhtmYvSNVhOOCLhXpJBSMsckJ6r5YTvJLRdXFIIZZku6TBe4D9MS5h0XRXCMu26/0s54ayELSQPbxlbPOtFzvEEmZmIlR1BJzKdkmt1OteaiOlaHdVca8EE+4iExgBm1RIRDlZLv9GCaOTZvF4Q90tobGFWLfFvibKbCsVYVDQaA5jVorHgisbVlRqNqVOjMbNoCcNJ6bSYrogjamRcbFY3VuPSe2iure4nNdyZwa1uj/R+qOUYYkCNxxsgHx6KkA5NPrzQ2PpquSHvuF4jlLOCAVdo5uplK4oix5qN7cBMXHZnyD0Boy2bhQ6RcjaWK3EU5EULlUQkN4PEXqV4K+kz18jTmHDHCvY7LRSAe+44ruEDn03OtOZm20gnJibVp1XlG0Mp7nRuVhT3aukwNJYpO804d7KtcVDkXQKIdnbdAVdsW+yidSIK7ETP3nc5s0esfW/MtxgKqp2isqMkVwp5WjyndfrFikcDmFV5fUG8U5fSdouutTo0Oqg2dxxPEJUdfc16AyInVnxUW4B6X+H4qSr2ULMmUA6t4mJt13ZNBeNX91KNfX+t7emg2lbcTyyCeY4/F5VOQDaUwpAAAAAASUVORK5CYII="
        ></img>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
            <p className="mt-2">{selectedEvent.details}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={closeDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
