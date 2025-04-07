import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../utils/axiosConfig";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PlaceIcon from "@mui/icons-material/Place";
import CallIcon from "@mui/icons-material/Call";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const HealthResources = () => {
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const message = null;
  const navigate = useNavigate();

  const [newResource, setNewResource] = useState({
    name: "",
    address: "",
    contact: "",
    category: "",
    services: "",
    appointmentAvailable: "",
  });

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = () => {
    const url = category ? `/resources/${category}` : "/resources";
    axiosConfig
      .get(url)
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching resources", error));
  };

  const resourceCategories = [
    "Hospital",
    "Clinic",
    "Mental Health",
    "Fitness Center",
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewResource({
      name: "",
      address: "",
      contact: "",
      category: "",
      services: "",
      appointmentAvailable: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axiosConfig.post("/resources", newResource);
      fetchResources();
      handleClose();
    } catch (error) {
      console.error("Failed to add resource", error);
    }
  };

  const handleBookAppointment = (resource) => {
    navigate("/book-appointment", { state: { selectedResource: resource } });
  };

  const isFormValid = Object.values(newResource).every(
    (value) => value !== "" && value !== null
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Local Health Resources
      </Typography>

      {/* Show Success or Error Message */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {/* Add Resource Button */}
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpen}>
        Add Resource
      </Button>

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {resourceCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Health Resources List */}
      <Grid container spacing={3}>
        {resources.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No resources found.
          </Typography>
        ) : (
          resources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={4} sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                      {resource.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <PlaceIcon
                        fontSize="small"
                        sx={{ mr: 0.5, verticalAlign: "middle" }}
                      />
                      {resource.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <CallIcon
                        fontSize="small"
                        sx={{ mr: 0.5, verticalAlign: "middle" }}
                      />
                      {resource.contact}
                    </Typography>
                    <Typography variant="body2">
                      <MedicalServicesIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {resource.services}
                    </Typography>
                    <Typography variant="body2">
                      Category:{" "}
                      <strong>
                        <em>{resource.category}</em>
                      </strong>
                    </Typography>
                    <Button
                      fullWidth
                      variant={
                        resource.appointmentAvailable ? "contained" : "outlined"
                      }
                      color={
                        resource.appointmentAvailable ? "success" : "warning"
                      }
                      onClick={() => handleBookAppointment(resource)}
                      disabled={!resource.appointmentAvailable}
                    >
                      {resource.appointmentAvailable
                        ? "Book Appointment"
                        : "Not Available"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Resource Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ fontSize: 22, fontWeight: "bold", textAlign: "center", mb: 1 }}
        >
          Add Health Resource
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
        >
          {/* Resource Name */}
          <FormControl fullWidth>
            <TextField
              label="Resource Name"
              name="name"
              value={newResource.name}
              onChange={handleChange}
              margin="dense"
              required
              InputProps={{
                startAdornment: (
                  <LocalHospitalIcon sx={{ color: "blue", mr: 1 }} />
                ),
              }}
            />
          </FormControl>

          {/* Address */}
          <FormControl fullWidth>
            <TextField
              label="Address"
              name="address"
              value={newResource.address}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <PlaceIcon sx={{ color: "green", mr: 1 }} />,
              }}
            />
          </FormControl>

          {/* Contact */}
          <FormControl fullWidth>
            <TextField
              label="Contact"
              name="contact"
              value={newResource.contact}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <CallIcon sx={{ color: "red", mr: 1 }} />,
              }}
            />
          </FormControl>

          {/* Category Selection */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newResource.category}
              onChange={handleChange}
              required
            >
              {resourceCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Services */}
          <FormControl fullWidth>
            <TextField
              label="Services (comma-separated)"
              name="services"
              value={newResource.services}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <MedicalServicesIcon sx={{ color: "purple", mr: 1 }} />
                ),
              }}
            />
          </FormControl>

          {/* Appointment Availability */}
          <FormControl fullWidth>
            <InputLabel>Allow Appointments?</InputLabel>
            <Select
              name="appointmentAvailable"
              value={String(newResource.appointmentAvailable)}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "appointmentAvailable",
                    value: e.target.value === "true",
                  },
                })
              }
              required
            >
              <MenuItem value="true">
                <CheckCircleIcon sx={{ color: "green", mr: 1 }} /> Yes
              </MenuItem>
              <MenuItem value="false">
                <CheckCircleIcon sx={{ color: "red", mr: 1 }} /> No
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isFormValid}
          >
            Add Resource
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthResources;
