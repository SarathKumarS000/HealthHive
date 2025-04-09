import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Collapse,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import {
  fetchVolunteerOpportunities,
  createVolunteerOpportunity,
  joinVolunteerOpportunity,
  fetchJoinedOpportunityIds,
} from "../services/apiService";

const Volunteer = () => {
  const user = useSelector((state) => state.auth.user);
  const [opportunities, setOpportunities] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [joinedIds, setJoinedIds] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadOpportunities = async () => {
    try {
      const res = await fetchVolunteerOpportunities();
      setOpportunities(res.data);

      if (user?.id) {
        const joined = await fetchJoinedOpportunityIds(user.id);
        setJoinedIds(joined.data || []);
      }
    } catch (err) {
      console.error("Error loading opportunities", err);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleChange = (e) => {
    setNewOpportunity({ ...newOpportunity, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { title, description, location, date } = newOpportunity;
    if (!title.trim() || !description.trim() || !location.trim() || !date) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "warning",
      });
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      setSnackbar({
        open: true,
        message: "Date cannot be in the past!",
        severity: "warning",
      });
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createVolunteerOpportunity(newOpportunity);
      await loadOpportunities();
      setNewOpportunity({ title: "", description: "", location: "", date: "" });
      setFormOpen(false);
      setSnackbar({
        open: true,
        message: "Opportunity created!",
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to create opportunity", err);
      setSnackbar({
        open: true,
        message: err.response?.data || "Failed to create opportunity",
        severity: "error",
      });
    }
  };

  const handleJoin = async (id) => {
    if (!user?.id) {
      return setSnackbar({
        open: true,
        message: "Please log in to join.",
        severity: "info",
      });
    }

    try {
      await joinVolunteerOpportunity(id, user.id);
      setJoinedIds((prev) => [...prev, id]);
      setSnackbar({
        open: true,
        message: "Successfully joined!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to join. You may have already joined.",
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Volunteer Opportunities
      </Typography>

      {/* Toggle Form */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Button
          startIcon={formOpen ? <CancelIcon /> : <AddCircleOutlineIcon />}
          variant="outlined"
          onClick={() => setFormOpen(!formOpen)}
        >
          {formOpen ? "Cancel" : "Add Opportunity"}
        </Button>

        <Collapse in={formOpen}>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={newOpportunity.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={newOpportunity.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              label="Location"
              name="location"
              value={newOpportunity.location}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newOpportunity.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
              required
            />
            <Button variant="contained" onClick={handleCreate}>
              Submit Opportunity
            </Button>
          </Box>
        </Collapse>
      </Box>

      {/* Opportunities List */}
      <Grid container spacing={3}>
        {opportunities.map((op) => {
          const isPast = new Date(op.date) < new Date();
          const isJoined = joinedIds.includes(op.id);

          return (
            <Grid item xs={12} sm={6} md={4} key={op.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{op.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {op.description}
                  </Typography>
                  <Typography variant="body2">📍 {op.location}</Typography>
                  <Typography variant="body2">📅 {op.date}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    🧑‍💼 Posted by: {op.postedBy?.username}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    disabled={isJoined || isPast}
                    onClick={() => handleJoin(op.id)}
                  >
                    {isPast ? "Closed" : isJoined ? "Joined" : "Join"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Volunteer;
