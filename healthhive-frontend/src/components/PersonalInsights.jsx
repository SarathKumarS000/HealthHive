import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { Pie, Line } from "react-chartjs-2";
import {
  DirectionsWalk,
  LocalFireDepartment,
  Hotel,
  Mood,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { fetchPersonalInsights } from "../services/apiService";
import { moods, moodColors } from "../utils/commons";
import dayjs from "dayjs";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import "chartjs-plugin-trendline";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

const PersonalInsights = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [view, setView] = useState("steps");
  const [range, setRange] = useState("week");
  const animateChart = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  dayjs.extend(isSameOrAfter);

  useEffect(() => {
    if (user?.id) {
      fetchPersonalInsights(user.id).then((res) => {
        setData(res.data);
      });
    }
  }, [user]);

  if (!data) return <Typography sx={{ mt: 4 }}>Loading insights...</Typography>;

  const moodLabels = moods.map((m) => m.label);
  const moodData = moods.map((m) => data.moodCounts[m.key] || 0);
  const moodColorsArray = moods.map((m) => moodColors[m.key]);

  const now = dayjs();
  const cutoffDate =
    range === "week" ? now.subtract(6, "day") : now.subtract(29, "day");

  const filteredData = data.dailySummaries.filter((d) =>
    dayjs(d.date).isSameOrAfter(cutoffDate, "day")
  );

  const bestDayIndex = filteredData.findIndex(
    (d) => d.date === data.bestDay?.date
  );

  const lineChartData = {
    labels: filteredData.map((d) => dayjs(d.date).format("DD/MM")),
    datasets: [
      {
        label:
          view === "steps"
            ? "Steps"
            : view === "calories"
            ? "Calories"
            : "Sleep Hours",
        data: filteredData.map((d) =>
          view === "steps"
            ? d.totalSteps
            : view === "calories"
            ? d.totalCalories
            : d.totalSleepHours
        ),
        borderColor:
          view === "steps"
            ? "#1976D2"
            : view === "calories"
            ? "#F44336"
            : "#4CAF50",
        pointRadius: filteredData.map((_, idx) =>
          idx === bestDayIndex ? 6 : 3
        ),
        pointBackgroundColor: filteredData.map((_, idx) =>
          idx === bestDayIndex ? "#ff9800" : "#1976D2"
        ),
        trendlineLinear: {
          style: "rgba(255,105,180,0.8)",
          lineStyle: "dotted",
          width: 2,
        },
        tension: 0.3,
      },
    ],
  };

  return (
    <Container sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📊 Personal Health Insights
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <DirectionsWalk color="primary" fontSize="large" />
              <Typography variant="subtitle1">Avg Steps</Typography>
              <Typography variant="h5">
                {Math.round(data.averageSteps)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <LocalFireDepartment color="error" fontSize="large" />
              <Typography variant="subtitle1">Avg Calories</Typography>
              <Typography variant="h5">
                {Math.round(data.averageCalories)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Hotel color="secondary" fontSize="large" />
              <Typography variant="subtitle1">Avg Sleep</Typography>
              <Typography variant="h5">
                {data.averageSleepHours.toFixed(1)} hrs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: moodColors[data.mostCommonMood],
              color: "white",
            }}
          >
            <CardContent>
              <Mood fontSize="large" />
              <Typography variant="subtitle1">Most Common Mood</Typography>
              <Typography variant="h5">
                {moods.find((m) => m.key === data.mostCommonMood)?.label ||
                  "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        elevation={3}
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 3,
          p: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Mood Distribution Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <Pie
            data={{
              labels: moodLabels,
              datasets: [{ data: moodData, backgroundColor: moodColorsArray }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { boxWidth: 16 } },
              },
            }}
          />
        </Box>
      </Card>

      {/* Best Day Card */}
      {data.bestDay && (
        <Card
          sx={{
            mt: 4,
            mb: 3,
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(to right, #fff3e0, #ffe0b2)",
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🏆 Best Day: {dayjs(data.bestDay.date).format("MMM D, YYYY")}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            👣 Steps: <strong>{data.bestDay.steps}</strong>
          </Typography>
          <Typography>
            🔥 Calories: <strong>{data.bestDay.calories}</strong>
          </Typography>
          <Typography>
            😴 Sleep: <strong>{data.bestDay.sleepHours} hrs</strong>
          </Typography>
        </Card>
      )}

      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
        mt={4}
        mb={2}
      >
        {["steps", "calories", "sleep"].map((type) => (
          <Button
            key={type}
            variant={view === type ? "contained" : "outlined"}
            color={
              type === "steps"
                ? "primary"
                : type === "calories"
                ? "error"
                : "success"
            }
            onClick={() => setView(type)}
            sx={{ minWidth: 100 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
        {["week", "month"].map((r) => (
          <Button
            key={r}
            variant={range === r ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setRange(r)}
            sx={{ minWidth: 100 }}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </Button>
        ))}
      </Box>

      <Card
        elevation={4}
        sx={{
          mt: 2,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: "#fafafa",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 600 }}
        >
          {range === "week" ? "Weekly" : "Monthly"}{" "}
          {view.charAt(0).toUpperCase() + view.slice(1)} Trend
        </Typography>

        <Box sx={{ height: 350, mt: 2 }}>
          {animateChart && (
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000 },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `${ctx.dataset.label}: ${ctx.raw} ${
                          view === "sleep"
                            ? "hrs"
                            : view === "calories"
                            ? "kcal"
                            : ""
                        }`,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#666" },
                    grid: { color: "#e0e0e0" },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { color: "#666" },
                    grid: { color: "#e0e0e0" },
                    title: {
                      display: true,
                      text:
                        view === "steps"
                          ? "Steps"
                          : view === "calories"
                          ? "Calories (kcal)"
                          : "Sleep (hrs)",
                      color: "#444",
                      font: { size: 14, weight: "bold" },
                    },
                  },
                },
              }}
            />
          )}
        </Box>
      </Card>
    </Container>
  );
};

export default PersonalInsights;
