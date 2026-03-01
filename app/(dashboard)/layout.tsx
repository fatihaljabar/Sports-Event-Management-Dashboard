"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active nav based on pathname
  const getActiveNav = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/events")) return "events";
    if (pathname.startsWith("/participants")) return "participants";
    if (pathname.startsWith("/results")) return "results";
    if (pathname.startsWith("/medals")) return "medals";
    return "dashboard";
  };

  const activeNav = getActiveNav();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNavChange = (id: string) => {
    // Navigate to the appropriate route
    switch (id) {
      case "dashboard":
        window.location.href = "/";
        break;
      case "events":
        window.location.href = "/events";
        break;
      case "participants":
        window.location.href = "/participants";
        break;
      case "results":
        window.location.href = "/results";
        break;
      case "medals":
        window.location.href = "/medals";
        break;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#F8FAFC",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopHeader onCreateEvent={() => setShowCreateModal(true)} />
        {children}
      </div>
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

import { useState } from "react";
import { CreateEventModal } from "@/components/CreateEventModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
