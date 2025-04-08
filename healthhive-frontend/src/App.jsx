import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./utils/auth";
import { loginSuccess, logout, setAuthChecked } from "./redux/authSlice";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CommunityInsights from "./components/CommunityInsights";
import HealthLog from "./components/HealthLog";
import HealthResources from "./components/HealthResources";
import BookAppointment from "./components/BookAppointment";
import MyAppointments from "./components/MyAppointments";
import MentalHealthSupport from "./components/MentalHealthSupport";
import EmergencySupport from "./components/EmergencySupport";
import Volunteer from "./components/Volunteer";
import HealthChallenges from "./components/HealthChallenges";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.auth.authChecked);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/register") {
      const loadUser = async () => {
        try {
          const user = await fetchCurrentUser();
          if (user) dispatch(loginSuccess(user));
          else dispatch(logout());
        } catch (err) {
          dispatch(logout());
        } finally {
          dispatch(setAuthChecked(true));
        }
      };
      loadUser();
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  if (!authChecked) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Navbar />
      <Box sx={{ pt: 10 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<CommunityInsights />} />
            <Route path="/health-log" element={<HealthLog />} />
            <Route path="/resources" element={<HealthResources />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/mental-health" element={<MentalHealthSupport />} />
            <Route path="/emergency" element={<EmergencySupport />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/challenges" element={<HealthChallenges />} />
          </Route>
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
