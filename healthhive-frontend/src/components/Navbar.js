import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
// import logo from "../assets/logo.png"; // Your logo

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect mobile screens

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* AppBar Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          {isLoggedIn && isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo & App Name */}
          {/* <img src={logo} alt="HealthHive Logo" style={{ height: 40, marginRight: 10 }} /> */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HealthHive
          </Typography>

          {/* Navigation Links (Visible on Desktop) */}
          {isLoggedIn && !isMobile && (
            <>
              <Button color="inherit" component={Link} to="/">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/insights">
                Insights
              </Button>
              <Button color="inherit" component={Link} to="/health-log">
                Health Log
              </Button>
              <Button color="inherit" component={Link} to="/resources">
                Resources
              </Button>
              <Button color="inherit" component={Link} to="/book-appointment">
                Book Appointment
              </Button>
              <Button color="inherit" component={Link} to="/my-appointments">
                My Appointments
              </Button>

              <Button color="inherit" component={Link} to="/mental-health">
                Mental Health
              </Button>
              <Button color="inherit" component={Link} to="/emergency">
                Emergency
              </Button>
              <Button color="inherit" component={Link} to="/volunteer">
                Volunteer
              </Button>
              <Button color="inherit" component={Link} to="/challenges">
                Challenges
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* Show Login/Register for Non-Logged Users */}
          {!isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for Mobile */}
      {isLoggedIn && isMobile && (
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider />
            <ListItem
              button
              component={Link}
              to="/insights"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Community Insights" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/health-log"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Health Log" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/resources"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Resources" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/mental-health"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Mental Health" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/emergency"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Emergency" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/volunteer"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Volunteer" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/challenges"
              onClick={toggleDrawer}
            >
              <ListItemText primary="Challenges" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
