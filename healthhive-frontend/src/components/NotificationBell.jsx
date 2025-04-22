import { useContext, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  CircularProgress,
  Divider,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationContext } from "../contexts/NotificationContext";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    fetchNotificationsFn,
    markAllNotificationsRead,
    markNotificationAsRead,
  } = useContext(NotificationContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = async (id) => {
    setLoadingId(id);
    await markNotificationAsRead(id);
    await fetchNotificationsFn();
    setLoadingId(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleOpen}
          aria-label="show notifications"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            maxWidth: 420,
            width: "auto",
            px: 0,
            py: 0,
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                ":hover": { textDecoration: "underline" },
              }}
              onClick={async () => {
                await markAllNotificationsRead();
                await fetchNotificationsFn();
              }}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              You're all caught up!
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleNotificationClick(n.id)}
              sx={{
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 0.5,
                py: 1.2,
                backgroundColor: n.read
                  ? "inherit"
                  : "rgba(25, 118, 210, 0.08)",
                fontWeight: n.read ? "normal" : "bold",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Box display="flex" width="100%" alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    lineHeight: 1.4,
                  }}
                >
                  {n.message}
                </Typography>
                {loadingId === n.id && (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                )}
              </Box>
              {n.createdAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>
              )}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
