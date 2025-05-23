import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Collapse,
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { FocusTrap } from "@mui/base";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  fetchAllChallenges,
  createChallenge,
  joinChallenge,
  cancelJoinChallenge,
  fetchMyChallenges,
  fetchAllChallengeStats,
} from "../services/apiService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ChallengeProgress from "./ChallengeProgress";
import { NotificationContext } from "../contexts/NotificationContext";

const HealthChallenges = () => {
  const user = useSelector((state) => state.auth.user);
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    goal: "",
    goalType: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);
  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const [showProgress, setShowProgress] = useState(false);
  const [stats, setStats] = useState({});
  const [goalFilter, setGoalFilter] = useState("");
  const { fetchNotificationsFn } = useContext(NotificationContext);

  useEffect(() => {
    if (user?.id) {
      loadAll();
      loadMine();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadAll = async () => {
    try {
      const res = await fetchAllChallenges();
      setChallenges(res.data || []);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load challenges.",
        severity: "error",
      });
    }
  };

  const loadMine = async () => {
    try {
      const res = await fetchMyChallenges(user.id);
      await fetchAllChallengeStats().then((res) => setStats(res.data));
      setMyChallenges(res.data.map((c) => c.id));
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load your joined challenges.",
        severity: "error",
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateDates = () => {
    const start = dayjs(form.startDate);
    const end = dayjs(form.endDate);
    if (start.isBefore(today)) return "Start date cannot be in the past.";
    if (end.isBefore(start)) return "End date must be after start date.";
    return null;
  };

  const handleCreate = async () => {
    if (
      !form.title ||
      !form.startDate ||
      !form.endDate ||
      !form.goal ||
      !form.goalType
    ) {
      return setSnackbar({
        open: true,
        message: "All fields are required.",
        severity: "warning",
      });
    }
    const dateError = validateDates();
    if (dateError) {
      return setSnackbar({
        open: true,
        message: dateError,
        severity: "warning",
      });
    }

    try {
      const formattedForm = {
        ...form,
        startDate: form.startDate + "T00:00:00",
        endDate: form.endDate + "T23:59:59",
      };
      await createChallenge(formattedForm);
      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        goal: "",
        goalType: "",
      });
      setFormOpen(false);
      await loadAll();
      setSnackbar({
        open: true,
        message: "Challenge created successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to create challenge.",
        severity: "error",
      });
    }
  };

  const handleJoin = async (id) => {
    setLoading(true);
    try {
      await joinChallenge(id, user.id);
      await fetchNotificationsFn();
      await loadMine();
      setSnackbar({
        open: true,
        message: "Joined challenge!",
        severity: "success",
      });
    } catch {
      setSnackbar({ open: true, message: "Join failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setLoading(true);
    try {
      await cancelJoinChallenge(id, user.id);
      await fetchNotificationsFn();
      await loadMine();
      setSnackbar({ open: true, message: "Canceled join.", severity: "info" });
    } catch {
      setSnackbar({ open: true, message: "Cancel failed.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const sortedChallenges = (
    tab === 0
      ? challenges
      : challenges.filter((c) => myChallenges.includes(c.id))
  )
    .filter((c) => !goalFilter || c.goalType === goalFilter)
    .sort((a, b) => {
      const isAEnded = dayjs(a.endDate).isBefore(dayjs());
      const isBEnded = dayjs(b.endDate).isBefore(dayjs());
      if (isAEnded === isBEnded) {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      return isAEnded ? 1 : -1;
    });

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          filter: showProgress ? "blur(2px)" : "none",
          pointerEvents: showProgress ? "none" : "auto",
          userSelect: showProgress ? "none" : "auto",
        }}
        aria-hidden={showProgress}
        tabIndex={showProgress ? -1 : undefined}
      >
        <Typography variant="h4" align="center" gutterBottom>
          🏁 Health Challenges
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{
            mb: 2,
            ".MuiTabs-indicator": { backgroundColor: "#1976d2" },
            ".MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
            },
          }}
        >
          <Tab label="All Challenges" />
          <Tab label="My Challenges" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {tab === 1 && myChallenges.length > 0 && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setShowProgress(true)}
              sx={{ flex: 1, fontSize: "16px", py: 1.5 }}
            >
              📊 View Overall Progress
            </Button>
          )}

          <Button
            variant={formOpen ? "contained" : "outlined"}
            color={formOpen ? "error" : "primary"}
            onClick={() => setFormOpen(!formOpen)}
            sx={{ flex: 1, fontSize: "16px", py: 1.5 }}
          >
            {formOpen ? "Cancel" : "Create Challenge"}
          </Button>

          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              label="Goal Type"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="steps">Steps</MenuItem>
              <MenuItem value="calories">Calories</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Collapse in={formOpen}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 3,
              maxWidth: 600,
              mx: "auto",
              p: 3,
              borderRadius: 3,
              boxShadow: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: tomorrow }}
              fullWidth
              required
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: form.startDate || tomorrow }}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <TextField
                select
                label="Goal Type"
                name="goalType"
                value={form.goalType}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Goal Type</MenuItem>
                <MenuItem value="steps">Steps</MenuItem>
                <MenuItem value="calories">Calories</MenuItem>
              </TextField>
            </FormControl>
            <TextField
              label="Goal"
              name="goal"
              type="number"
              value={form.goal}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 0 || e.target.value === "") {
                  setForm({ ...form, goal: e.target.value });
                }
              }}
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ py: 1.5, fontSize: "16px" }}
            >
              Submit
            </Button>
          </Box>
        </Collapse>

        <Grid container spacing={2}>
          {sortedChallenges.map((c) => {
            const isEnded = dayjs(c.endDate).isBefore(dayjs());
            return (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card
                  sx={{
                    opacity: isEnded ? 0.6 : 1,
                    pointerEvents: isEnded || showProgress ? "none" : "auto",
                    transition: "0.3s",
                    borderRadius: 3,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
                      gutterBottom
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      {c.description || "No description provided."}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 1 }}
                    >
                      📅 {dayjs(c.startDate).format("MMM D, YYYY")} -{" "}
                      {dayjs(c.endDate).format("MMM D, YYYY")}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      🎯 {c.goal} {c.goalType}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      👥 {stats[c.id]?.totalParticipants || 0} joined | ✅{" "}
                      {stats[c.id]?.completedParticipants || 0} completed
                    </Typography>
                    {isEnded ? (
                      <Typography
                        variant="body2"
                        color="error"
                        align="center"
                        sx={{ mt: 1.5, fontWeight: 500 }}
                      >
                        🚫 Challenge Ended
                      </Typography>
                    ) : myChallenges.includes(c.id) ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancel(c.id)}
                        disabled={loading}
                      >
                        Cancel Join
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleJoin(c.id)}
                        disabled={loading}
                      >
                        Join Challenge
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {showProgress && (
        <FocusTrap open>
          <Box
            sx={{
              position: "fixed",
              top: 64,
              right: 0,
              bottom: 0,
              width: { xs: "100%", sm: "100%", md: "50%" },
              maxWidth: "100%",
              bgcolor: "background.paper",
              zIndex: 1300,
              boxShadow: 3,
              overflowY: "auto",
              borderLeft: "1px solid #ddd",
            }}
          >
            <Box sx={{ p: 2, position: "relative" }}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <IconButton onClick={() => setShowProgress(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <ChallengeProgress />
            </Box>
          </Box>
        </FocusTrap>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 500, fontSize: "15px" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HealthChallenges;
