// pages/404.js
import Link from "next/link";

// ... existing code ...
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The event you are looking for does not exist.
      </p>
      <Link
        href="/events"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Events tab
      </Link>
    </div>
  );
};

export default NotFound;
