import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axiosConfig from "../utils/axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement, // Required for Pie Charts
  Tooltip,
  Legend,
} from "chart.js";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HotelIcon from "@mui/icons-material/Hotel";
import MoodIcon from "@mui/icons-material/Mood";

// ** Register the required Chart.js components **
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const CommunityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const moods = [
    { key: "happy", label: "Happy 😊" },
    { key: "neutral", label: "Neutral 😐" },
    { key: "sad", label: "Sad 😢" },
    { key: "stressed", label: "Stressed 😰" },
    { key: "excited", label: "Excited 🤩" },
    { key: "relaxed", label: "Relaxed 😌" },
    { key: "angry", label: "Angry 😡" },
    { key: "tired", label: "Tired 😴" },
    { key: "anxious", label: "Anxious 😟" },
    { key: "motivated", label: "Motivated 🚀" },
    { key: "bored", label: "Bored 🥱" },
    { key: "", label: "No Mood ❔" },
  ];

  const moodColors = {
    happy: "rgba(255, 206, 86, 0.6)", // Yellow
    neutral: "rgba(153, 102, 255, 0.6)", // Purple
    sad: "rgba(54, 162, 235, 0.6)", // Blue
    stressed: "rgba(255, 99, 132, 0.6)", // Red
    excited: "rgba(255, 165, 0, 0.6)", // Orange
    relaxed: "rgba(60, 179, 113, 0.6)", // Green
    angry: "rgba(255, 69, 0, 0.6)", // Dark Red
    tired: "rgba(169, 169, 169, 0.6)", // Dark Gray
    anxious: "rgba(238, 130, 238, 0.6)", // Pinkish Purple
    motivated: "rgba(0, 128, 255, 0.6)", // Bright Blue
    bored: "rgba(192, 192, 192, 0.6)", // Light Gray
    "": "rgba(200, 200, 200, 0.6)", // Gray for No Mood
  };

  useEffect(() => {
    axiosConfig
      .get("/insights")
      .then((response) => {
        setInsights(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching community insights", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Typography>Loading insights...</Typography>;
  if (!insights) return <Typography>Error loading insights.</Typography>;

  const moodLabels = moods.map((m) => m.label);
  const moodData = moods.map((m) => insights.mood_counts[m.key] || 0);
  const moodColorsArray = moods.map((m) => moodColors[m.key]);

  const mostCommonMood = moods.find((m) => m.key === insights.most_common_mood);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 2, textAlign: "center" }}>
        Community Health Insights
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <HotelIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            <CardContent>
              <Typography variant="h6">Avg Sleep Hours</Typography>
              <Typography variant="h4">
                {insights.average_sleep.toFixed(1)} hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <DirectionsWalkIcon sx={{ fontSize: 40, color: "#388e3c" }} />
            <CardContent>
              <Typography variant="h6">Avg Steps</Typography>
              <Typography variant="h4">
                {insights.average_steps.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
            <CardContent>
              <Typography variant="h6">Avg Calories Burned</Typography>
              <Typography variant="h4">
                {insights.average_calories.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: moodColors[insights.most_common_mood],
              color: "white",
            }}
          >
            <MoodIcon sx={{ fontSize: 40 }} />
            <CardContent>
              <Typography variant="h6">Most Common Mood</Typography>
              <Typography variant="h4">
                {mostCommonMood?.label || "Unknown ❔"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mood Distribution Pie Chart */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Mood Distribution
      </Typography>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Pie
        data={{
          labels: moodLabels,
          datasets: [
            {
              label: "Number of People",
              data: moodData,
              backgroundColor: moodColorsArray,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
          },
        }}
      />
      </div>
    </Container>
  );
};

export default CommunityInsights;
