"use client"; // Ensure this component is a client component
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the toggle button

export default function LinkNavBar() {
  let currentPath = "";
  if (typeof window !== "undefined") {
    currentPath = window.location.pathname;
  }
  const parentRoute = currentPath.split("/").slice(0, -1).join("/");
  const [activeRoute, setActiveRoute] = useState(
    currentPath === "/" ? "/" : parentRoute
  ); // Set initial active route to current path or parent route
  const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu

  // const [activeRoute, setActiveRoute] = useState("/");
  // const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu

  // useEffect(() => {
  //   const currentPath = window.location.pathname;
  //   const parentRoute = currentPath.split("/").slice(0, -1).join("/");
  //   setActiveRoute(currentPath === "/" ? "/" : parentRoute);
  // }, []); // Run only once after the component mounts

  function handleClickLink(ref) {
    setActiveRoute(ref); // Set the active route directly
    setIsOpen(false); // Close the menu when a link is clicked
  }

  return (
    <div className="relative">
      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden text-white w-[5rem]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Navigation Links */}
      <div
        className={`flex flex-col md:flex-row md:space-x-4 absolute md:static bg-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? "top-12 left-0 w-full z-50" : "top-[-200px] left-0"
        }`}
      >
        <Link
          onClick={() => handleClickLink("/")}
          href="/"
          className={`text-white relative px-3 py-2 rounded transition-all duration-300 ease-in-out ${
            activeRoute === "/" ? "font-bold" : "hover:bg-gray-700"
          }`}
        >
          Home
          {activeRoute === "/" && (
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded transition-all duration-300 ease-in-out" />
          )}
        </Link>
        <Link
          onClick={() => handleClickLink("/events")}
          href="/events"
          className={`text-white relative px-3 py-2 rounded transition-all duration-300 ease-in-out ${
            activeRoute === "/events" ? "font-bold" : "hover:bg-gray-700"
          }`}
        >
          Events
          {activeRoute === "/events" && (
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded transition-all duration-300 ease-in-out" />
          )}
        </Link>
        <Link
          onClick={() => handleClickLink("/ranking")}
          href="/ranking"
          className={`text-white relative px-3 py-2 rounded transition-all duration-300 ease-in-out ${
            activeRoute === "/ranking" ? "font-bold" : "hover:bg-gray-700"
          }`}
        >
          Ranking
          {activeRoute === "/ranking" && (
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded transition-all duration-300 ease-in-out" />
          )}
        </Link>
        <Link
          onClick={() => handleClickLink("/about")}
          href="/about"
          className={`text-white relative px-3 py-2 rounded transition-all duration-300 ease-in-out ${
            activeRoute === "/about" ? "font-bold" : "hover:bg-gray-700"
          }`}
        >
          About Us
          {activeRoute === "/about" && (
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded transition-all duration-300 ease-in-out" />
          )}
        </Link>
      </div>
    </div>
  );
}
