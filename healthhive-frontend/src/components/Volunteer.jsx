import React, { useEffect, useState, useContext } from "react";
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
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";
import {
  fetchVolunteerOpportunities,
  createVolunteerOpportunity,
  joinVolunteerOpportunity,
  fetchJoinedOpportunityIds,
} from "../services/apiService";
import { NotificationContext } from "../contexts/NotificationContext";

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
  const [expandedId, setExpandedId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { fetchNotificationsFn } = useContext(NotificationContext);

  const loadOpportunities = async () => {
    try {
      const res = await fetchVolunteerOpportunities();
      setOpportunities(res.data || []);
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
    // eslint-disable-next-line
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
      await loadOpportunities();
      await fetchNotificationsFn();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to join. You may have already joined.",
        severity: "error",
      });
    }
  };

  const toggleJoinedList = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 5, mb: 2, fontWeight: 600 }}
      >
        Volunteer Opportunities
      </Typography>

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Button
          startIcon={formOpen ? <CancelIcon /> : <AddCircleOutlineIcon />}
          variant={formOpen ? "outlined" : "contained"}
          onClick={() => setFormOpen(!formOpen)}
          color={formOpen ? "error" : "primary"}
        >
          {formOpen ? "Cancel" : "Add Opportunity"}
        </Button>

        <Collapse in={formOpen}>
          <Paper elevation={3} sx={{ p: 3, mt: 3, maxWidth: 600, mx: "auto" }}>
            <Grid container spacing={2}>
              {["title", "description", "location"].map((field) => (
                <Grid item xs={12} key={field}>
                  <TextField
                    label={field[0].toUpperCase() + field.slice(1)}
                    name={field}
                    value={newOpportunity[field]}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline={field === "description"}
                    rows={field === "description" ? 3 : 1}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button variant="contained" onClick={handleCreate}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </Box>

      <Grid container spacing={4}>
        {[...opportunities]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((op) => {
            const isPast = new Date(op.date) < new Date();
            const isJoined = joinedIds.includes(op.id);
            const isExpanded = expandedId === op.id;

            return (
              <Grid item xs={12} sm={6} md={4} key={op.id}>
                <Card
                  sx={{
                    borderLeft: isPast ? "5px solid #ccc" : "5px solid #1976d2",
                    transition: "all 0.3s",
                    backgroundColor: isPast ? "#f7f7f7" : "#ffffff",
                  }}
                  elevation={3}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {op.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {op.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocationOnIcon fontSize="small" /> {op.location}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CalendarTodayIcon fontSize="small" /> {op.date}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PersonIcon fontSize="small" /> {op.postedBy?.username}
                    </Typography>

                    <Chip
                      icon={<PeopleIcon />}
                      label={`Joined: ${op.joinedUsers?.length || 0}`}
                      size="small"
                      sx={{ mt: 1 }}
                    />

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={isJoined || isPast}
                        onClick={() => handleJoin(op.id)}
                      >
                        {isPast ? "Closed" : isJoined ? "Joined" : "Join"}
                      </Button>

                      {op.joinedUsers?.length > 0 && (
                        <Button
                          size="small"
                          fullWidth
                          sx={{ mt: 1 }}
                          onClick={() => toggleJoinedList(op.id)}
                        >
                          {isExpanded ? "Hide Members" : "View Members"}
                        </Button>
                      )}
                    </Box>

                    <Collapse in={isExpanded}>
                      <List dense sx={{ mt: 1 }}>
                        {op.joinedUsers.map((user) => (
                          <React.Fragment key={user.id}>
                            <ListItem>
                              <ListItemText
                                primary={user.fullName}
                                secondary={user.email}
                              />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    </Collapse>
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
