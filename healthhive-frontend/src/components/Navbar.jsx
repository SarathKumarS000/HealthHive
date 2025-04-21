import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/apiService";
import logo from "../assets/logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventIcon from "@mui/icons-material/Event";
import EmergencyIcon from "@mui/icons-material/Report";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MoodIcon from "@mui/icons-material/Mood";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLoggedIn = useSelector((state) => !!state.auth.user);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({});

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navGroups = [
    {
      label: "Insights",
      items: [
        {
          text: "Community Insights",
          path: "/insights",
          icon: <InsightsIcon fontSize="small" />,
        },
        {
          text: "My Insights",
          path: "/my-insights",
          icon: <MoodIcon fontSize="small" />,
        },
      ],
    },
    {
      label: "Appointments",
      items: [
        {
          text: "Book Appointment",
          path: "/book-appointment",
          icon: <EventIcon fontSize="small" />,
        },
        {
          text: "My Appointments",
          path: "/my-appointments",
          icon: <PersonSearchIcon fontSize="small" />,
        },
      ],
    },
    {
      label: "Support",
      items: [
        {
          text: "Mental Health",
          path: "/mental-health",
          icon: <FavoriteIcon fontSize="small" />,
        },
        {
          text: "Emergency",
          path: "/emergency",
          icon: <EmergencyIcon fontSize="small" />,
        },
      ],
    },
  ];

  const standaloneLinks = [
    { text: "Dashboard", path: "/" },
    { text: "Health Log", path: "/health-log" },
    { text: "Resources", path: "/resources" },
    { text: "Volunteer", path: "/volunteer" },
    { text: "Challenges", path: "/challenges" },
  ];

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Insights", icon: <InsightsIcon />, path: "/insights" },
    { text: "Health Log", icon: <FavoriteIcon />, path: "/health-log" },
    { text: "Resources", icon: <EventIcon />, path: "/resources" },
    {
      text: "Book Appointment",
      icon: <EventIcon />,
      path: "/book-appointment",
    },
    { text: "My Appointments", icon: <EventIcon />, path: "/my-appointments" },
    { text: "Mental Health", icon: <FavoriteIcon />, path: "/mental-health" },
    { text: "Emergency", icon: <EmergencyIcon />, path: "/emergency" },
    { text: "Volunteer", icon: <VolunteerActivismIcon />, path: "/volunteer" },
    { text: "Challenges", icon: <EmojiEventsIcon />, path: "/challenges" },
  ];

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const renderMenu = (group) => (
    <Menu
      anchorEl={menuAnchor[group.label]}
      open={Boolean(menuAnchor[group.label])}
      onClose={() => setMenuAnchor({ ...menuAnchor, [group.label]: null })}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        elevation: 0,
        sx: {
          mt: 1,
          borderRadius: 2,
          minWidth: 240,
          px: 1,
          py: 0.5,
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
          boxShadow:
            "0px 3px 12px rgba(0, 0, 0, 0.06), 0px 4px 20px rgba(0, 0, 0, 0.08)",
          animation: "fadeSlideIn 200ms ease",
        },
      }}
      MenuListProps={{
        disablePadding: true,
        sx: {
          "& .MuiMenuItem-root": {
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.2,
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "#333",
            transition: "all 0.2s ease",
            "& svg": {
              fontSize: 20,
              color: "#1976d2",
            },
            "&:hover": {
              bgcolor: "#f5faff",
              color: "#1976d2",
            },
          },
          "& .Mui-selected": {
            bgcolor: "#e3f2fd !important",
            color: "#0d47a1",
            fontWeight: 600,
          },
        },
      }}
    >
      {group.items.map((item) => (
        <MenuItem
          key={item.text}
          component={Link}
          to={item.path}
          onClick={() => setMenuAnchor({ ...menuAnchor, [group.label]: null })}
          selected={location.pathname === item.path}
        >
          {item.icon}
          <Typography variant="body2">{item.text}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#155FA0" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          {/* Left: Logo */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ height: 36, width: 36, mr: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              HealthHive
            </Typography>
          </Box>

          {/* Center: Navigation */}
          {!isMobile && isLoggedIn && (
            <Box display="flex" alignItems="center" gap={2}>
              {standaloneLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  sx={{
                    fontWeight:
                      location.pathname === link.path ? "bold" : "normal",
                    borderBottom:
                      location.pathname === link.path
                        ? "2px solid #fff"
                        : "none",
                    textTransform: "none",
                  }}
                >
                  {link.text}
                </Button>
              ))}

              {navGroups.map((group) => (
                <Box key={group.label}>
                  <Button
                    endIcon={<ExpandMoreIcon />}
                    color="inherit"
                    onClick={(e) =>
                      setMenuAnchor({
                        ...menuAnchor,
                        [group.label]: e.currentTarget,
                      })
                    }
                    sx={{ textTransform: "none" }}
                  >
                    {group.label}
                  </Button>
                  {renderMenu(group)}
                </Box>
              ))}
            </Box>
          )}

          {isLoggedIn && !isMobile ? (
            <Box display="flex" alignItems="center" gap={1.5}>
              <NotificationBell />
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#fff",
                  color: "#155FA0",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                onClick={handleLogout}
                color="inherit"
                startIcon={<LogoutIcon />}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          ) : isMobile ? (
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              <Button
                component={Link}
                to="/login"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          <Divider />
          <ListItem
            button
            onClick={() => {
              toggleDrawer();
              handleLogout();
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: "0.95rem" }}>Logout</Typography>
              }
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
