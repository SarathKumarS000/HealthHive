import React, { useState } from "react";
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
} from "@mui/material";
import axiosConfig from "../utils/axiosConfig";

const HealthLog = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [healthData, setHealthData] = useState({
    steps: "",
    calories: "",
    sleepHours: "",
    mood: "",
  });
  const [message, setMessage] = useState(null);

  const moods = [
    { key: "Happy 😊", value: "happy" },
    { key: "Neutral 😐", value: "neutral" },
    { key: "Sad 😢", value: "sad" },
    { key: "Stressed 😰", value: "stressed" },
    { key: "Excited 🤩", value: "excited" },
    { key: "Relaxed 😌", value: "relaxed" },
    { key: "Angry 😡", value: "angry" },
    { key: "Tired 😴", value: "tired" },
    { key: "Anxious 😟", value: "anxious" },
    { key: "Motivated 🚀", value: "motivated" },
    { key: "Bored 🥱", value: "bored" },
  ];

  const handleChange = (e) => {
    setHealthData({ ...healthData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosConfig.post("/health/log", { ...healthData, userId: user.id });
      setMessage({ type: "success", text: "Health data logged successfully!" });
      setHealthData({ steps: "", calories: "", sleepHours: "", mood: "" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to log health data." });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ mt: 4, mb: 3 }}>
        Log Your Health Data
      </Typography>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Card elevation={3} sx={{ mt: 3, p: 3 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Grid container spacing={2}>
              {/* Steps */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Steps"
                  name="steps"
                  type="number"
                  onChange={handleChange}
                  value={healthData.steps}
                  fullWidth
                  required
                />
              </Grid>

              {/* Calories */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Calories Burned"
                  name="calories"
                  type="number"
                  onChange={handleChange}
                  value={healthData.calories}
                  fullWidth
                  required
                />
              </Grid>

              {/* Sleep Hours */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sleep Hours"
                  name="sleepHours"
                  type="number"
                  onChange={handleChange}
                  value={healthData.sleepHours}
                  fullWidth
                  required
                />
              </Grid>

              {/* Mood Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Mood</InputLabel>
                  <Select name="mood" value={healthData.mood} onChange={handleChange}>
                    {moods.map((mood) => (
                      <MenuItem key={mood.value} value={mood.value}>
                        {mood.key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HealthLog;
