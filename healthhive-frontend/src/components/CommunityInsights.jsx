import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  DirectionsWalk as StepsIcon,
  LocalFireDepartment as CaloriesIcon,
  Hotel as SleepIcon,
  Mood as MoodIcon,
} from "@mui/icons-material";
import { moods, moodColors } from "../utils/commons";
import { fetchInsights } from "../services/apiService";

const CommunityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInsights()
      .then((res) => {
        setInsights(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching community insights", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <Typography sx={{ mt: 4 }}>Loading insights...</Typography>;
  if (!insights)
    return <Typography sx={{ mt: 4 }}>Error loading insights.</Typography>;

  const moodLabels = moods.map((m) => m.label);
  const moodData = moods.map((m) => insights.mood_counts[m.key] || 0);
  const moodColorsArray = moods.map((m) => moodColors[m.key]);
  const mostCommonMood = moods.find((m) => m.key === insights.most_common_mood);

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🌍 Community Health Insights
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Aggregated health data from all users across the platform.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
            }}
          >
            <SleepIcon sx={{ fontSize: 40, color: "#1976d2" }} />
            <CardContent>
              <Typography variant="h6">Avg Sleep</Typography>
              <Typography variant="h4">
                {insights.average_sleep.toFixed(1)} hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
            }}
          >
            <StepsIcon sx={{ fontSize: 40, color: "#388e3c" }} />
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
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
            }}
          >
            <CaloriesIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
            <CardContent>
              <Typography variant="h6">Avg Calories</Typography>
              <Typography variant="h4">
                {insights.average_calories.toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 3,
              color: "#fff",
              backgroundColor: moodColors[insights.most_common_mood] || "#888",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
            }}
          >
            <MoodIcon sx={{ fontSize: 40 }} />
            <CardContent>
              <Typography variant="h6">Top Mood</Typography>
              <Typography variant="h4">
                {mostCommonMood?.label || "Unknown ❔"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        elevation={4}
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 6,
          p: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Mood Distribution Across Users
        </Typography>
        <Box sx={{ height: 350 }}>
          <Pie
            data={{
              labels: moodLabels,
              datasets: [
                {
                  label: "People",
                  data: moodData,
                  backgroundColor: moodColorsArray,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { boxWidth: 16 },
                },
              },
            }}
          />
        </Box>
      </Card>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/my-insights")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          📈 Compare Your Insights
        </Button>

        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Explore how your personal trends stack up against the community.
        </Typography>
      </Box>
    </Container>
  );
};

export default CommunityInsights;
