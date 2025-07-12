"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { HomeIcon, LogOutIcon, UserIcon } from "lucide-react";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAppStore();

  return (
    <header className="w-full bg-gray-900 text-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="/globe.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl">Code Titans</span>
      </div>
      <nav className="flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            <a href="/" className="hover:text-blue-400 transition flex items-center space-x-2">
              <HomeIcon className="h-6 w-6" />
            </a>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6" />
                <span>{user}</span>
              </div>
              <button 
                onClick={logout}
                className="hover:text-red-400 transition cursor-pointer"
              >
                <LogOutIcon className="h-6 w-6" />
              </button>
            </div>
          </>
        ) : (
          <a href="/login" className="hover:text-blue-400 transition">Login</a>
        )}
      </nav>
    </header>
  );
};

export default Header;
