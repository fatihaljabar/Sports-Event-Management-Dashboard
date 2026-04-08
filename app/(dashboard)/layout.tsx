"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { TopHeader, BreadcrumbItem } from "@/components/admin/layout/TopHeader";
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

  // Generate breadcrumbs based on current pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = pathname;

    // Root/Dashboard
    if (path === "/") {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Dashboard", href: "/", isClickable: true },
      ];
    }

    // Events list - /events
    if (path === "/events") {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Events", href: "/events", isClickable: true },
      ];
    }

    // Event detail - /events/[id]
    if (path.startsWith("/events/") && path.split("/").length > 2) {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Events", href: "/events", isClickable: true },
        { label: "Event Details", href: path, isClickable: false },
      ];
    }

    // Participants
    if (path === "/participants") {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Participants", href: "/participants", isClickable: true },
      ];
    }

    // Results
    if (path === "/results") {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Results", href: "/results", isClickable: true },
      ];
    }

    // Medals
    if (path === "/medals") {
      return [
        { label: "Home", href: "/", isClickable: true },
        { label: "Medals", href: "/medals", isClickable: true },
      ];
    }

    // Default
    return [
      { label: "Home", href: "/", isClickable: true },
      { label: "Dashboard", href: "/", isClickable: true },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

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

  const handleSearch = (query: string) => {
    // Navigate to events page with search query
    if (query.trim()) {
      router.push(`/events?search=${encodeURIComponent(query)}`);
    } else {
      // If query is empty, go to events page without search param
      router.push("/events");
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
        <TopHeader
          onCreateEvent={() => setShowCreateModal(true)}
          onSearch={handleSearch}
          breadcrumbs={breadcrumbs}
        />
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
