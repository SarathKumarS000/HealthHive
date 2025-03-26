import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
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
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        My Appointments
      </Typography>
      <Grid container spacing={3}>
        {appointments.map((appt) => (
          <Grid item xs={12} sm={6} md={4} key={appt.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{appt.resource.name}</Typography>
                <Typography variant="body2">
                  {appt.resource.category}
                </Typography>
                <Typography variant="body2">{appt.resource.address}</Typography>
                <Typography variant="body2">
                  {new Date(appt.appointmentTime).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyAppointments;
