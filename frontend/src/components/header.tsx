import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-900 text-white shadow-md py-4 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="/globe.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl">Code Titans</span>
      </div>
      <nav className="space-x-6">
        <a href="/login" className="hover:text-blue-400 transition">Login</a>
      </nav>
    </header>
  );
};

export default Header;
