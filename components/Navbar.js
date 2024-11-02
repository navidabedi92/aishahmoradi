import React from "react";
import LinkNavBar from "./LinkNavBar"; // Import LinkNavBar
import LoginProfile from "./LoginProfile";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          MyApp
        </Link>
        <div className="flex items-center space-x-4">
          <LinkNavBar />
          <LoginProfile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
