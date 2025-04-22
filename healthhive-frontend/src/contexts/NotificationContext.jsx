import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
} from "../services/apiService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationsFn = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsFn();
  }, [fetchNotificationsFn]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotificationsFn,
        markAllNotificationsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
