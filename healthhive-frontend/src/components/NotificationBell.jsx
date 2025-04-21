import React, { useEffect, useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
} from "../services/apiService";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationsFn = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotificationsFn();
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotificationsFn();
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  useEffect(() => {
    fetchNotificationsFn();
  }, []);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 300, width: 300 } }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
        </MenuItem>
        {notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              sx={{ fontWeight: n.read ? "normal" : "bold" }}
              onClick={() => handleNotificationClick(n.id)}
            >
              {n.message}
            </MenuItem>
          ))
        )}
        {notifications.length > 0 && (
          <MenuItem onClick={markAllAsRead} sx={{ justifyContent: "center" }}>
            Mark all as read
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
