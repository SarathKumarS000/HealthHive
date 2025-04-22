import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  TextField,
  MenuItem,
  Button,
  Alert,
  Stack,
  Box,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fetchAllResources, bookAppointment } from "../services/apiService";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { NotificationContext } from "../contexts/NotificationContext";

const generateDateTimeSlots = () => {
  const slots = [];
  const today = dayjs().startOf("day");

  for (let dayOffset = 1; dayOffset < 7; dayOffset++) {
    const date = today.add(dayOffset, "day").format("YYYY-MM-DD");

    [
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ].forEach((time) => {
      const formattedDateTime = `${date}T${time}:00.000`;
      slots.push({ label: `${date} - ${time}`, value: formattedDateTime });
    });
  }
  return slots;
};

const BookAppointment = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const selectedResource = location.state?.selectedResource || null;

  const [resources, setResources] = useState([]);
  const [appointment, setAppointment] = useState({
    resourceId: selectedResource ? selectedResource.id : "",
    dateTime: "",
  });
  const [message, setMessage] = useState(null);
  const [resourceDisabled, setResourceDisabled] = useState(!!selectedResource);
  const dateTimeSlots = generateDateTimeSlots();
  const { fetchNotificationsFn } = useContext(NotificationContext);

  useEffect(() => {
    fetchAllResources()
      .then((response) => {
        const availableResources = response.data.filter(
          (res) => res.appointmentAvailable
        );
        setResources(availableResources);
      })
      .catch((error) => console.error("Error fetching resources", error));
  }, []);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) {
      return setMessage({ type: "error", text: "User not logged in!" });
    }
    if (!appointment.resourceId || !appointment.dateTime) {
      return setMessage({ type: "error", text: "Please fill all fields." });
    }

    try {
      await bookAppointment({
        user: { id: user.id },
        resource: { id: appointment.resourceId },
        appointmentTime: appointment.dateTime,
      });
      setMessage({
        type: "success",
        text: "Appointment booked successfully!",
      });
      setAppointment({ resourceId: "", dateTime: "" });
      setResourceDisabled(false);
      await fetchNotificationsFn();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to book appointment." });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          mt: 5,
          p: 3,
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ mb: 1 }}>
                <EventIcon
                  color="primary"
                  sx={{ fontSize: 40, verticalAlign: "middle", mr: 1 }}
                />
                Book Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule an appointment with a local health provider
              </Typography>
            </Box>

            {message && (
              <Alert
                severity={message.type}
                icon={
                  message.type === "success" ? <CheckCircleIcon /> : undefined
                }
              >
                {message.text}
              </Alert>
            )}

            <FormControl fullWidth required disabled={resourceDisabled}>
              <TextField
                select
                label="Select Health Resource"
                name="resourceId"
                value={appointment.resourceId}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select a Resource</em>
                </MenuItem>

                {resources.map((res) => (
                  <MenuItem
                    key={res.id}
                    value={res.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocalHospitalIcon
                      sx={{ color: "primary.main", fontSize: 20 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {res.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {res.category}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <FormControl fullWidth required>
              <TextField
                select
                label="Select Date & Time"
                name="dateTime"
                value={appointment.dateTime}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      borderRadius: 2,
                      boxShadow: 3,
                    },
                  },
                }}
              >
                {dateTimeSlots.map((slot, index) => (
                  <MenuItem
                    key={index}
                    value={slot.value}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {slot.label}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={!appointment.resourceId || !appointment.dateTime}
            >
              Confirm Booking
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookAppointment;
