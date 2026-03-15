"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type NotificationType = "event" | "key" | "participant" | "result";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  createdAt: number; // timestamp for cleanup
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "time" | "isRead" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Storage key for localStorage
const STORAGE_KEY = "sports_dashboard_notifications";
const MAX_NOTIFICATIONS = 50;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Load notifications from localStorage
const loadFromStorage = (): NotificationItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load notifications from storage:", error);
  }
  return [];
};

// Save notifications to localStorage
const saveToStorage = (notifications: NotificationItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to save notifications to storage:", error);
  }
};

// Format relative time
const formatTime = (): string => {
  return "Just now";
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    // Cleanup old notifications (older than 24 hours)
    const now = Date.now();
    const cleaned = loaded.filter((n) => now - n.createdAt < ONE_DAY_MS);
    setNotifications(cleaned);
    setIsLoaded(true);
  }, []);

  // Save to localStorage when notifications change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(notifications);
    }
  }, [notifications, isLoaded]);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<NotificationItem, "id" | "time" | "isRead" | "createdAt">) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: generateId(),
      time: formatTime(),
      isRead: false,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
