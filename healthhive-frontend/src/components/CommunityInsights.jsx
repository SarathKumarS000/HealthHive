import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axiosConfig from "../utils/axiosConfig";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HotelIcon from "@mui/icons-material/Hotel";
import MoodIcon from "@mui/icons-material/Mood";
import { moods, moodColors } from "../utils/commons";

const CommunityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

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
