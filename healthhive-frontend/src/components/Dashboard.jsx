import React, { useEffect, useState } from "react";
import axiosConfig from "../utils/axiosConfig";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Paper,
} from "@mui/material";
import {
  DirectionsWalk as StepsIcon,
  LocalFireDepartment as CaloriesIcon,
  Hotel as SleepIcon,
  Mood as MoodIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";

const Dashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails?.id) {
      setUser(userDetails);
      axiosConfig
        .get(`/health/${userDetails.id}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setHealthData(response.data);
          }
        })
        .catch((error) => console.error("Error fetching health data", error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const latest = healthData.length ? healthData[healthData.length - 1] : null;

  const chartData = {
    labels: healthData.map((entry) => dayjs(entry.date).format("DD/MM")),
    datasets: [
      {
        label: "Steps",
        data: healthData.map((entry) => entry.steps),
        fill: false,
        yAxisID: "steps",
        borderColor: "#1976D2",
        tension: 0.2,
      },
      {
        label: "Calories",
        data: healthData.map((entry) => entry.calories),
        fill: false,
        yAxisID: "calories",
        borderColor: "#FF5722",
        tension: 0.2,
      },
      {
        label: "Sleep Hours",
        data: healthData.map((entry) => entry.sleepHours),
        fill: false,
        yAxisID: "sleep",
        borderColor: "#4CAF50",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      steps: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Steps",
        },
      },
      calories: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Calories (kcal)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      sleep: {
        type: "linear",
        position: "right",
        offset: true,
        title: {
          display: true,
          text: "Sleep (hrs)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading)
    return <Typography sx={{ mt: 4 }}>Loading health data...</Typography>;
  if (!user)
    return (
      <Typography sx={{ mt: 4 }}>
        Please log in to view your dashboard.
      </Typography>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{ width: 64, height: 64, bgcolor: "primary.main", mr: 2 }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {latest ? (
        <>
          <Typography variant="h6" gutterBottom>
            Last Updated: {dayjs(latest.date).format("DD MMM YYYY HH:mm")}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <StepsIcon sx={{ fontSize: 40, color: "#1976D2", mr: 2 }} />
                <CardContent>
                  <Typography variant="subtitle2">Steps</Typography>
                  <Typography variant="h5">{latest.steps}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <CaloriesIcon sx={{ fontSize: 40, color: "#FF5722", mr: 2 }} />
                <CardContent>
                  <Typography variant="subtitle2">Calories</Typography>
                  <Typography variant="h5">{latest.calories} kcal</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <SleepIcon sx={{ fontSize: 40, color: "#4CAF50", mr: 2 }} />
                <CardContent>
                  <Typography variant="subtitle2">Sleep</Typography>
                  <Typography variant="h5">{latest.sleepHours} hrs</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <MoodIcon sx={{ fontSize: 40, color: "#FFC107", mr: 2 }} />
                <CardContent>
                  <Typography variant="subtitle2">Mood</Typography>
                  <Typography variant="h5">
                    {latest.mood
                      ? latest.mood.charAt(0).toUpperCase() +
                        latest.mood.slice(1)
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Trends
            </Typography>
            <Line data={chartData} options={chartOptions} />
          </Box>

          {/* Health Tip */}
          <Paper
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: "#f9fbe7",
              borderLeft: "5px solid #8bc34a",
            }}
          >
            <Typography variant="subtitle1">
              <strong>💡 Health Tip:</strong> Drink at least 2 liters of water a
              day and aim for 7-8 hours of sleep!
            </Typography>
          </Paper>
        </>
      ) : (
        <Box textAlign="center" mt={5}>
          <Typography variant="h6" color="textSecondary">
            No health data available. Log your first entry!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
