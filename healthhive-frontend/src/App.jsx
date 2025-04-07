import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
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

function App() {
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
}

export default App;
