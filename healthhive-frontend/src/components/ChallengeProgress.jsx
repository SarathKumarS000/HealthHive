import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchChallengeProgress } from "../services/apiService";

const ChallengeProgress = () => {
  const user = useSelector((state) => state.auth.user);
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchChallengeProgress(user.id)
        .then((res) => setProgressList(res.data))
        .catch((err) => console.error("Error fetching progress", err));
    }
  }, [user]);

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
      <Typography variant="h5" gutterBottom>
        🏆 Your Challenge Progress
      </Typography>
      <Grid container spacing={2}>
        {progressList.map((p) => (
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
                    🎉{" "}
                    <strong style={{ marginLeft: 8 }}>
                      Challenge Completed!
                    </strong>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ChallengeProgress;
