"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { CreateEventModal } from "@/components/CreateEventModal";

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleNavChange = (id: string) => {
    // Navigate to the appropriate route using Next.js router
    switch (id) {
      case "dashboard":
        router.push("/");
        break;
      case "events":
        router.push("/events");
        break;
      case "participants":
        router.push("/participants");
        break;
      case "results":
        router.push("/results");
        break;
      case "medals":
        router.push("/medals");
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
