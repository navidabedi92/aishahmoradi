"use client";
import { useEffect } from "react";

export default function DetailEvents({ selectedEventInput }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold">{selectedEventInput.Name}</h3>
        <p className="mt-2">
          Start Date:{" "}
          {new Date(selectedEventInput.StartDate).toLocaleDateString()}
        </p>
        <p className="mt-2">
          End Date: {new Date(selectedEventInput.EndDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
