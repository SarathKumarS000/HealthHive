import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  LinearProgress,
  Grid,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import {
  DirectionsWalk as StepsIcon,
  LocalFireDepartment as CaloriesIcon,
  Hotel as SleepIcon,
  Mail as MailIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDailySummaries,
  fetchChallengeProgress,
} from "../services/apiService";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
          setChallengeProgress((progressRes.data || []).reverse());
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
        title: { display: true, text: "Steps" },
      },
      calories: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Calories (kcal)" },
        grid: { drawOnChartArea: false },
      },
      sleep: {
        type: "linear",
        position: "right",
        offset: true,
        title: { display: true, text: "Sleep (hrs)" },
        grid: { drawOnChartArea: false },
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
      {/* User Info Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            gap: { xs: 2, sm: 3 },
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
              fontSize: 32,
            }}
          >
            {userDetails?.fullName?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            >
              Welcome, {userDetails?.fullName || "User"}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              sx={{ mb: 1 }}
            >
              <AccountCircleIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Username:</strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {userDetails?.username || "Username not available"}
              </Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              sx={{ mb: 1 }}
            >
              <MailIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {userDetails?.email || "Email not available"}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              We're glad to have you on board! Let’s make progress towards your
              health goals.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Daily Summary Section */}
      {latest ? (
        <>
          <Typography variant="h6" gutterBottom>
            🗓️ Last Summary: {dayjs(latest.date).format("DD MMM YYYY")}
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
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

          {/* 7 Days Trend Chart */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              📊 Last 7 Days Trend
            </Typography>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <Line data={chartData} options={chartOptions} />
            </Paper>
          </Box>

          {/* Health Tip */}
          <Paper
            elevation={1}
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: "#e8f5e9",
              borderLeft: "6px solid #66bb6a",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1">
              <strong>💡 Health Tip:</strong> Drink at least 2 liters of water a
              day and aim for 7–8 hours of sleep!
            </Typography>
          </Paper>

          {/* Ongoing Challenges */}
          <OngoingChallenges
            challenges={challengeProgress}
            navigate={navigate}
          />
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
  <Grid item xs={12} sm={6} md={4} sx={{ height: "100%" }}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 3,
        boxShadow: 2,
        px: 2,
        py: 1.5,
        height: "100%",
        mb: { xs: 1, sm: 0 },
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <Box
        sx={{
          mr: 2,
          color,
          fontSize: 36,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 0.2 }}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={600} lineHeight={1.2}>
          {value}
        </Typography>
      </Box>
    </Card>
  </Grid>
);

const OngoingChallenges = ({ challenges, navigate }) => {
  const ongoing = challenges.filter(
    (p) =>
      p.progressPercentage < 100 && dayjs().isSameOrBefore(dayjs(p.endDate), "day")
  );

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        🏃‍♂️ Ongoing Challenges
      </Typography>
      {ongoing.length > 0 ? (
        <Grid container spacing={2}>
          {ongoing.slice(0, 2).map((p) => (
            <Grid item xs={12} sm={6} key={p.challengeId}>
              <Card
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  backgroundColor: "#f0f8ff",
                  borderRadius: 3,
                  boxShadow: 1,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {p.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(p.startDate).format("DD MMM")} –{" "}
                    {dayjs(p.endDate).format("DD MMM")}
                  </Typography>
                  <Typography variant="body2" mt={0.5}>
                    Goal: {p.goal} {p.goalType} | Achieved: {p.achieved}
                  </Typography>
                  <Box sx={{ my: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={p.progressPercentage}
                      sx={{ height: 10, borderRadius: 5 }}
                      color="primary"
                    />
                  </Box>
                  <Typography variant="caption" fontWeight="medium">
                    {p.progressPercentage}% completed
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    mt={1}
                    color="text.secondary"
                  >
                    ⏳ Ends in {dayjs(p.endDate).diff(dayjs(), "day")} days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
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
};

export default Dashboard;
