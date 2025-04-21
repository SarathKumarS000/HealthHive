import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Avatar,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  DirectionsWalk as StepsIcon,
  LocalFireDepartment as CaloriesIcon,
  Hotel as SleepIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDailySummaries,
  fetchChallengeProgress,
} from "../services/apiService";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

const Dashboard = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const [dailySummaries, setDailySummaries] = useState([]);
  const [challengeProgress, setChallengeProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (userDetails?.id) {
          const [summaryRes, progressRes] = await Promise.all([
            fetchDailySummaries(userDetails.id),
            fetchChallengeProgress(userDetails.id),
          ]);
          setDailySummaries(summaryRes.data || []);
          setChallengeProgress(progressRes.data.reverse() || []);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userDetails]);

  const latest = dailySummaries[dailySummaries.length - 1];

  dayjs.extend(isSameOrAfter);
  const today = dayjs();
  const sevenDaysAgo = today.subtract(6, "day");

  const recentSummaries = dailySummaries
    .filter((entry) => dayjs(entry.date).isSameOrAfter(sevenDaysAgo, "day"))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = {
    labels: recentSummaries.map((entry) => dayjs(entry.date).format("DD/MM")),
    datasets: [
      {
        label: "Steps",
        data: recentSummaries.map((entry) => entry.totalSteps),
        yAxisID: "steps",
        borderColor: "#1976D2",
        tension: 0.2,
      },
      {
        label: "Calories",
        data: recentSummaries.map((entry) => entry.totalCalories),
        yAxisID: "calories",
        borderColor: "#FF5722",
        tension: 0.2,
      },
      {
        label: "Sleep Hours",
        data: recentSummaries.map((entry) => entry.totalSleepHours),
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
      legend: { position: "top" },
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

  if (loading) {
    return <Typography sx={{ mt: 4 }}>Loading dashboard...</Typography>;
  }

  if (!userDetails) {
    return (
      <Typography sx={{ mt: 4 }}>
        Please log in to view your dashboard.
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{ width: 64, height: 64, bgcolor: "primary.main", mr: 2 }}
          >
            {userDetails.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">{userDetails.username}</Typography>
            <Typography variant="body2" color="textSecondary">
              {userDetails.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {latest ? (
        <>
          <Typography variant="h6" gutterBottom>
            Last Summary: {dayjs(latest.date).format("DD MMM YYYY")}
          </Typography>

          <Grid container spacing={3}>
            <DashboardStat
              icon={<StepsIcon />}
              label="Steps"
              value={latest.totalSteps}
              color="#1976D2"
            />
            <DashboardStat
              icon={<CaloriesIcon />}
              label="Calories"
              value={`${latest.totalCalories} kcal`}
              color="#FF5722"
            />
            <DashboardStat
              icon={<SleepIcon />}
              label="Sleep"
              value={`${latest.totalSleepHours} hrs`}
              color="#4CAF50"
            />
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              Last 7 Days Trend
            </Typography>
            <Line data={chartData} options={chartOptions} />
          </Box>

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

          {(() => {
            const ongoingChallenges = challengeProgress.filter(
              (p) =>
                p.progressPercentage < 100 &&
                dayjs().isBefore(dayjs(p.endDate), "day")
            );

            return (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" gutterBottom>
                  🏃‍♂️ Ongoing Challenges
                </Typography>

                {ongoingChallenges.length > 0 ? (
                  <Grid container spacing={2}>
                    {ongoingChallenges.slice(0, 2).map((p) => (
                      <Grid item xs={12} sm={6} key={p.challengeId}>
                        <Card
                          sx={{
                            border: "1px solid #ccc",
                            backgroundColor: "#f5faff",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "scale(1.02)" },
                          }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {p.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(p.startDate).format("DD MMM YYYY")} –{" "}
                              {dayjs(p.endDate).format("DD MMM YYYY")}
                            </Typography>
                            <Typography variant="body2" mt={0.5}>
                              Goal: {p.goal} {p.goalType} | Achieved:{" "}
                              {p.achieved}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={p.progressPercentage}
                              sx={{ my: 1, height: 8, borderRadius: 4 }}
                              color="primary"
                            />
                            <Typography variant="caption">
                              {p.progressPercentage}% completed
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              mt={1}
                              color="text.secondary"
                            >
                              ⏳ Ends in {dayjs(p.endDate).diff(dayjs(), "day")}{" "}
                              days
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ mt: 2 }}
                    color="text.secondary"
                  >
                    No active challenges right now. Join one to get started!
                  </Typography>
                )}

                <Box textAlign="center" mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/challenge-progress")}
                  >
                    View All Progress
                  </Button>
                </Box>
              </Box>
            );
          })()}
        </>
      ) : (
        <Box textAlign="center" mt={5}>
          <Typography variant="h6" color="textSecondary">
            No health summaries available. Start logging your daily data!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

const DashboardStat = ({ icon, label, value, color }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
      <Box sx={{ mr: 2, color }}>{icon}</Box>
      <CardContent>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;
