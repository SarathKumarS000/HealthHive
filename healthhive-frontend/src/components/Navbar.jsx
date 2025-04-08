import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EmergencyIcon from "@mui/icons-material/Report";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "@mui/material/styles";
import { logoutUser } from "../services/apiService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => !!state.auth.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Insights", icon: <InsightsIcon />, path: "/insights" },
    { text: "Health Log", icon: <FavoriteIcon />, path: "/health-log" },
    { text: "Resources", icon: <EventNoteIcon />, path: "/resources" },
    {
      text: "Book Appointment",
      icon: <EventNoteIcon />,
      path: "/book-appointment",
    },
    {
      text: "My Appointments",
      icon: <EventNoteIcon />,
      path: "/my-appointments",
    },
    { text: "Mental Health", icon: <FavoriteIcon />, path: "/mental-health" },
    { text: "Emergency", icon: <EmergencyIcon />, path: "/emergency" },
    { text: "Volunteer", icon: <VolunteerActivismIcon />, path: "/volunteer" },
    { text: "Challenges", icon: <EmojiEventsIcon />, path: "/challenges" },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          {isLoggedIn && isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            HealthHive
          </Typography>

          {isLoggedIn && !isMobile && (
            <Box>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    mx: 0.5,
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                    borderBottom:
                      location.pathname === item.path
                        ? "2px solid #fff"
                        : "none",
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ textTransform: "none", mx: 1 }}
              >
                Logout
              </Button>
            </Box>
          )}

          {!isLoggedIn && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{ textTransform: "none", mx: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                sx={{ textTransform: "none", mx: 1 }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      {isLoggedIn && isMobile && (
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
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
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
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
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
