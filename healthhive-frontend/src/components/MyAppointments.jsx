import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axiosConfig from "../utils/axiosConfig";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axiosConfig
        .get(`/appointments/${user.id}`)
        .then((response) => setAppointments(response.data))
        .catch((error) => console.error("Error fetching appointments", error));
    }
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
        📅 My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 5 }}>
          You have no appointments yet. Explore resources and book one!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appt) => (
            <Grid item xs={12} sm={6} md={4} key={appt.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {appt.resource.name}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    {appt.resource.category}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" ml={1}>
                      {appt.resource.address}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" alignItems="center">
                    <CalendarMonthIcon fontSize="small" color="action" />
                    <Typography variant="body2" ml={1}>
                      {new Date(appt.appointmentTime).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyAppointments;
