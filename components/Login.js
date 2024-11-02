"use client";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import { useSelector } from "react-redux"; // Removed Provider import

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const stateStore = useSelector((state) => state.login);
  console.log(stateStore);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {!stateStore && (
        <button
          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded"
          onClick={openModal}
        >
          Login
        </button>
      )}

      <AuthModal isOpen={isModalOpen} onClose={closeModal} />

      {stateStore && (
        <>
          <button
            className="bg-slate-50 text-lime-400 rounded-xl hover:bg-yellow-700 hover:text-white px-3 py-2"
            onClick={openSidebar}
          >
            Profile
          </button>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </>
      )}
    </>
  );
}
