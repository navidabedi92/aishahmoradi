"use client";

import { SliceAction } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({ isOpen, onClose }) {
  const storeState = useSelector((state) => state);
  const dispatch = useDispatch();

  // Effect to prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-70 z-10"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0   h-full bg-gray-800 text-white transition-transform duration-300 z-20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Profile Menu</h2>
          {storeState.userData.Type === "Organization" && (
            <button
              className="mt-4 w-full text-left hover:bg-gray-700 px-3 py-2 rounded transition duration-200"
              onClick={() => {
                // Handle create new event
                console.log("Create New Event");
              }}
            >
              Create New Event
            </button>
          )}
          <button
            className="mt-2 w-full text-left hover:bg-gray-700 px-3 py-2 rounded transition duration-200"
            onClick={() => {
              // Handle showing events
              console.log("Show Events");
            }}
          >
            My Events
          </button>
          <button
            className="mt-2 w-full text-left hover:bg-gray-700 px-3 py-2 rounded transition duration-200"
            onClick={() => {
              dispatch(SliceAction.clearUserLogin());
              alert("You have been logged out.");
              onClose();
              // Clear local storage data
            }}
          >
            Logout
          </button>
        </div>
        <button
          className="absolute left-4 text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </>
  );
}
