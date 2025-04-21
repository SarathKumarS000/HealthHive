import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchChallengeProgress } from "../services/apiService";
import dayjs from "dayjs";

const ChallengeProgress = () => {
  const user = useSelector((state) => state.auth.user);
  const [progressList, setProgressList] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchChallengeProgress(user.id)
        .then((res) => setProgressList(res.data || []))
        .catch((err) => console.error("Error fetching progress", err));
    }
  }, [user]);

  const today = dayjs();

  const inProgress = progressList.filter(
    (p) => p.progressPercentage < 100 && dayjs(p.endDate).isAfter(today, "day")
  );
  const completed = progressList.filter((p) => p.progressPercentage >= 100);
  const missed = progressList.filter(
    (p) => p.progressPercentage < 100 && dayjs(p.endDate).isBefore(today, "day")
  );

  const tabs = ["⏳ In Progress", "✅ Completed", "❌ Missed"];
  const categorized = [inProgress, completed, missed];

  const renderCard = (p, isMissed = false) => (
    <Grid item xs={12} key={p.challengeId}>
      <Card
        sx={{
          border: isMissed
            ? "1px solid #f44336"
            : p.progressPercentage >= 100
            ? "2px solid #4caf50"
            : "1px solid #ccc",
          bgcolor:
            p.progressPercentage >= 100
              ? "#e8f5e9"
              : isMissed
              ? "#ffebee"
              : "background.paper",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {p.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dayjs(p.startDate).format("DD MMM YYYY")} –{" "}
            {dayjs(p.endDate).format("DD MMM YYYY")}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Goal: {p.goal} {p.goalType} | Achieved: {p.achieved}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={p.progressPercentage}
            sx={{ my: 1.5, height: 8, borderRadius: 4 }}
            color={
              isMissed
                ? "error"
                : p.progressPercentage >= 100
                ? "success"
                : "primary"
            }
          />

          <Typography
            variant="caption"
            color={isMissed ? "error" : "text.secondary"}
          >
            {p.progressPercentage}% completed
            {isMissed ? " — Challenge Ended" : ""}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const activeList = categorized[tab];

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
      <Typography variant="h5" gutterBottom>
        🏆 Your Challenge Progress
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
          {tabs.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>

      {activeList.length > 0 ? (
        <Grid container spacing={2}>
          {activeList.map((challenge) =>
            renderCard(challenge, tab === 2 /* isMissed */)
          )}
        </Grid>
      ) : (
        <Typography sx={{ mt: 4 }} color="text.secondary" align="center">
          {tab === 0
            ? "No ongoing challenges. Join one to get started!"
            : tab === 1
            ? "You haven’t completed any challenges yet."
            : "No missed challenges!"}
        </Typography>
      )}
    </Container>
  );
};

export default ChallengeProgress;
