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
  useTheme,
  Fade,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchChallengeProgress } from "../services/apiService";
import dayjs from "dayjs";

const ChallengeProgress = () => {
  const user = useSelector((state) => state.auth.user);
  const [progressList, setProgressList] = useState([]);
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (user?.id) {
      fetchChallengeProgress(user.id)
        .then((res) => setProgressList(res.data || []))
        .catch((err) => console.error("Error fetching progress", err));
    }
  }, [user]);

  const today = dayjs();

  const inProgress = progressList.filter(
    (p) =>
      p.progressPercentage < 100 &&
      dayjs(p.endDate).endOf("day").isSameOrAfter(today)
  );
  const completed = progressList.filter((p) => p.progressPercentage >= 100);
  const missed = progressList.filter(
    (p) =>
      p.progressPercentage < 100 &&
      dayjs(p.endDate).endOf("day").isBefore(today)
  );  

  const tabs = ["⏳ In Progress", "✅ Completed", "❌ Missed"];
  const categorized = [inProgress, completed, missed];
  const activeList = categorized[tab];

  const renderCard = (p, isMissed = false) => (
    <Grid item xs={12} sm={6} md={4} key={p.challengeId}>
      <Card
        elevation={3}
        sx={{
          borderLeft: `5px solid ${
            isMissed
              ? theme.palette.error.main
              : p.progressPercentage >= 100
              ? theme.palette.success.main
              : theme.palette.primary.main
          }`,
          bgcolor:
            p.progressPercentage >= 100
              ? "#e8f5e9"
              : isMissed
              ? "#ffebee"
              : "#f9f9f9",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
          },
          height: "100%",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {p.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            📅 {dayjs(p.startDate).format("DD MMM")} –{" "}
            {dayjs(p.endDate).format("DD MMM YYYY")}
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            🎯 <strong>Goal:</strong> {p.goal} {p.goalType} &nbsp;|&nbsp;
            <strong>Achieved:</strong> {p.achieved}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={p.progressPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 1.5,
              backgroundColor: "#ddd",
              [`& .MuiLinearProgress-bar`]: {
                background:
                  isMissed || p.progressPercentage >= 100
                    ? undefined
                    : "linear-gradient(90deg, #42a5f5, #478ed1)",
              },
            }}
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
            fontWeight={500}
            color={isMissed ? "error.main" : "text.secondary"}
          >
            {p.progressPercentage}% completed
            {isMissed ? " — Challenge Ended" : ""}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container sx={{ mt: 4, mb: 6 }} maxWidth="lg">
      <Typography variant="h5" fontWeight={600} gutterBottom>
        🏆 Your Challenge Progress
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, newVal) => setTab(newVal)}
          centered
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Box>

      {activeList.length > 0 ? (
        <Grid container spacing={3}>
          {activeList.map((challenge) => renderCard(challenge, tab === 2))}
        </Grid>
      ) : (
        <Fade in timeout={400}>
          <Typography
            sx={{
              mt: 6,
              color: "text.secondary",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            {tab === 0
              ? "No ongoing challenges. Join one to get started!"
              : tab === 1
              ? "You haven’t completed any challenges yet."
              : "No missed challenges!"}
          </Typography>
        </Fade>
      )}
    </Container>
  );
};

export default ChallengeProgress;
