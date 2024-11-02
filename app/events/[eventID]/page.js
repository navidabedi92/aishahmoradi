"use client";
import {
  checkUserLogin,
  FetchOrganizationEvents,
  FetchSpecificEvent,
} from "@/utils/Common";
import Image from "next/image";
import image1 from "../../../public/images/image1.jpg";
import image2 from "../../../public/images/image2.jpg";
import image3 from "../../../public/images/image3.jpg";
import image4 from "../../../public/images/image4.jpg";
import image5 from "../../../public/images/image5.jpg";
import image6 from "../../../public/images/image6.jpg";

import React, { useEffect, useState } from "react";

import { Provider } from "react-redux";
import { Store } from "@/store/store";
import { useRouter } from "next/navigation";
import ButtonEventDetails from "@/components/ButtonEventDetails";
import ImageSlider from "@/components/ImageSlider";
const randomImages = [image1, image2, image3, image4, image5, image6];

const EventsDetailsPage = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({
    detail: null,
    athletes: null,
    judges: null,
  });
  const eventID = React.use(params).eventID; // Correctly access eventID from params

  const router = useRouter();

  const fetchEventDetails = async () => {
    try {
      const response = await FetchSpecificEvent(eventID);

      if (response.data) {
        const { id, name, startDate, endDate, athletes, judges } =
          response.data;
        setEventData({
          detail: { id, name, startDate, endDate },
          athletes,
          judges,
        });
      } else {
        console.error("Failed to fetch events:", response);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventID) {
      fetchEventDetails();
    }
  }, [eventID]);

  const handleRefresh = () => {
    setLoading(true);
    fetchEventDetails();
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  const handleGoToEventsList = () => {
    router.push("/events");
  };

  return (
    <Provider store={Store}>
      <div className="flex flex-col sm:flex-row max-w-4xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Event Details
            </h2>
            {eventData.detail && (
              <>
                <ImageSlider
                  imageData={randomImages}
                  eventName={eventData.detail.name}
                />
                <p className="text-lg font-semibold">{eventData.detail.name}</p>
                <p className="text-gray-600">
                  Start Date:{" "}
                  <span className="font-medium">
                    {new Date(eventData.detail.startDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-600">
                  End Date:{" "}
                  <span className="font-medium">
                    {new Date(eventData.detail.endDate).toLocaleDateString()}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Judges</h3>
            {eventData.judges && eventData.judges.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700">
                {eventData.judges.map((judge) => (
                  <li key={judge.id} className="mb-1">
                    {judge.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No judges have taken part yet.</p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Athletes
            </h3>
            {eventData.athletes && eventData.athletes.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700">
                {eventData.athletes.map((athlete) => (
                  <li key={athlete.id} className="mb-1">
                    {athlete.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No athletes have taken part yet.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:w-1/3">
          <ButtonEventDetails
            eventID={eventID}
            eventJudes={eventData.judges}
            onRefresh={handleRefresh} // Pass the refresh function
          />
          <button
            href="/events"
            className="bg-gray-700 text-white text-lg px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 shadow"
            onClick={handleGoToEventsList}
          >
            Go to Events List
          </button>
        </div>
      </div>
    </Provider>
  );
};

export default EventsDetailsPage;
