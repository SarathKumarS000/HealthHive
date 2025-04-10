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

  const inProgress = progressList.filter((p) => p.progressPercentage < 100);
  const completed = progressList.filter((p) => p.progressPercentage >= 100);

  const renderCard = (p) => (
    <Grid item xs={12} key={p.challengeId}>
      <Card
        sx={{
          border:
            p.progressPercentage >= 100
              ? "2px solid #4caf50"
              : "1px solid #ccc",
          backgroundColor:
            p.progressPercentage >= 100 ? "#e8f5e9" : "background.paper",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {p.title}
          </Typography>

          <Typography variant="body2" gutterBottom>
            Goal: {p.goal} {p.goalType} | Achieved: {p.achieved}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={p.progressPercentage}
            sx={{ my: 2, height: 8, borderRadius: 4 }}
            color={p.progressPercentage >= 100 ? "success" : "primary"}
          />

          <Typography variant="caption" gutterBottom>
            {p.progressPercentage}% completed
          </Typography>

          {p.progressPercentage >= 100 && (
            <Typography
              variant="subtitle2"
              sx={{
                color: "green",
                mt: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              🎉 <strong style={{ marginLeft: 8 }}>Challenge Completed!</strong>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  const activeList = tab === 0 ? inProgress : completed;

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
      <Typography variant="h5" gutterBottom>
        🏆 Your Challenge Progress
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
          <Tab label="⏳ In Progress" />
          <Tab label="✅ Completed" />
        </Tabs>
      </Box>

      {activeList.length > 0 ? (
        <Grid container spacing={2}>
          {activeList.map(renderCard)}
        </Grid>
      ) : (
        <Typography sx={{ mt: 4 }} color="text.secondary" align="center">
          {tab === 0
            ? "No ongoing challenges. Join one to get started!"
            : "You haven’t completed any challenges yet."}
        </Typography>
      )}
    </Container>
  );
};

export default ChallengeProgress;
