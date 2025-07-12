import React from "react";
import Header from "@/components/header";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-1 h-full">
        {children}
      </main>
    </div>
  );
}
