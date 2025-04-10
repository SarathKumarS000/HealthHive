import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Slide,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  DirectionsWalk,
  LocalFireDepartment,
  Hotel,
  Mood,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  fetchHealthData,
  logHealthData,
  updateHealthLog,
  deleteHealthLog,
} from "../services/apiService";
import { moodOptions } from "../utils/commons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const HealthLog = () => {
  const user = useSelector((state) => state.auth.user);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    steps: "",
    calories: "",
    sleepHours: "",
    mood: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const alertRef = useRef(null);

  const loadLogs = async () => {
    try {
      const res = await fetchHealthData(user.id);
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadLogs();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ steps: "", calories: "", sleepHours: "", mood: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { steps, calories, sleepHours } = formData;

    if (steps < 0 || calories < 0 || sleepHours < 0) {
      setMessage({ type: "error", text: "Values cannot be negative." });
      return;
    }

    try {
      if (editingId) {
        await updateHealthLog(editingId, { ...formData, userId: user.id });
        setMessage({ type: "success", text: "Health log updated." });
      } else {
        await logHealthData({ ...formData, userId: user.id });
        setMessage({ type: "success", text: "Health data logged." });
      }
      resetForm();
      loadLogs();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data || "Failed to save data.",
      });
    }
  };

  const handleEdit = (log) => {
    const isToday = dayjs(log.date).isSame(dayjs(), "day");
    if (!isToday) {
      setMessage({
        type: "warning",
        text: "You can only edit today's logs.",
      });

      setTimeout(() => {
        alertRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      return;
    }

    setFormData({
      steps: log.steps,
      calories: log.calories,
      sleepHours: log.sleepHours,
      mood: log.mood,
    });
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteHealthLog(deleteId);
      setMessage({ type: "success", text: "Log deleted." });
      loadLogs();
    } catch {
      setMessage({ type: "error", text: "Failed to delete log." });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {editingId ? "Edit Health Log" : "Log Your Daily Health Data"}
      </Typography>

      <Slide in={!!message} direction="down" mountOnEnter unmountOnExit>
        <Box ref={alertRef}>
          <Alert
            severity={message?.type}
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message?.text}
          </Alert>
        </Box>
      </Slide>

      {/* Form */}
      <Card elevation={4} sx={{ borderRadius: 3, p: 2, mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Steps */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Steps Walked"
                  name="steps"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  value={formData.steps}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsWalk color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Calories */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Calories Burned"
                  name="calories"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  value={formData.calories}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalFireDepartment color="error" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Sleep Hours */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sleep Hours"
                  name="sleepHours"
                  type="number"
                  inputProps={{ min: 0, max: 24 }}
                  onChange={handleChange}
                  value={formData.sleepHours}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Hotel color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Mood */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Mood</InputLabel>
                  <Select
                    label="Mood"
                    name="mood"
                    value={formData.mood}
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <Mood />
                      </InputAdornment>
                    }
                  >
                    {moodOptions.map((m) => (
                      <MenuItem key={m.value} value={m.value}>
                        {m.key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Fade in timeout={300}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                mt={4}
                flexWrap="wrap"
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color={editingId ? "warning" : "primary"}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {editingId ? "Update Log" : "Submit"}
                </Button>

                {editingId && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                    size="large"
                    sx={{
                      px: 5,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Fade>
          </Box>
        </CardContent>
      </Card>

      {/* Log List */}
      {logs.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            📋 Your Previous Logs
          </Typography>
          <Grid container spacing={3}>
            {logs.map((log) => (
              <Grid item xs={12} sm={6} md={4} key={log.id}>
                <Card
                  sx={{
                    p: 2,
                    position: "relative",
                    border:
                      editingId === log.id
                        ? "2px solid #ff9800"
                        : deleteId === log.id
                        ? "2px solid #f44336"
                        : "1px solid #ddd",
                    backgroundColor:
                      editingId === log.id
                        ? "#fff3e0"
                        : deleteId === log.id
                        ? "#ffebee"
                        : "#fff",
                    transition: "0.3s ease",
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">
                      📅 {dayjs(log.date).format("MMM D, YYYY")}
                    </Typography>
                    <Typography>👣 Steps: {log.steps}</Typography>
                    <Typography>🔥 Calories: {log.calories}</Typography>
                    <Typography>😴 Sleep: {log.sleepHours} hrs</Typography>
                    <Typography>😊 Mood: {log.mood}</Typography>
                  </CardContent>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton size="small" onClick={() => handleEdit(log)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(log.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: { borderRadius: 3, p: 2, maxWidth: 400 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
          }}
        >
          <WarningAmberIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText sx={{ mt: 1 }}>
            Are you sure you want to delete this health log? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end" }}>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              setDeleteId(null);
            }}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthLog;
