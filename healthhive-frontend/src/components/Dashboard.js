import React, { useEffect, useState } from 'react';
import axiosConfig from '../utils/axiosConfig';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HotelIcon from '@mui/icons-material/Hotel';
import MoodIcon from '@mui/icons-material/Mood';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    
    if (userDetails?.id) {
      setUserId(userDetails.id);
      
      axiosConfig.get(`/health/${userDetails.id}`)
        .then(response => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setHealthData(response.data[response.data.length - 1]); // Get latest entry
          }
        })
        .catch(error => console.error('Error fetching dashboard data', error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Typography variant="h6" sx={{ mt: 3 }}>Loading health data...</Typography>;

  if (!userId) return <Typography variant="h6" sx={{ mt: 3 }}>User not logged in. Please log in first.</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>Personal Health Dashboard</Typography>

      {!healthData ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="textSecondary">
            No health data available. Log your first entry!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Steps */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <DirectionsWalkIcon sx={{ fontSize: 40, color: "#1976D2", mr: 2 }} />
              <CardContent>
                <Typography variant="h6">Steps Today</Typography>
                <Typography variant="h4">{healthData.steps}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Calories */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "#FF5722", mr: 2 }} />
              <CardContent>
                <Typography variant="h6">Calories Burned</Typography>
                <Typography variant="h4">{healthData.calories} kcal</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Sleep Hours */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <HotelIcon sx={{ fontSize: 40, color: "#4CAF50", mr: 2 }} />
              <CardContent>
                <Typography variant="h6">Sleep Hours</Typography>
                <Typography variant="h4">{healthData.sleepHours} hrs</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mood */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <MoodIcon sx={{ fontSize: 40, color: "#FFC107", mr: 2 }} />
              <CardContent>
                <Typography variant="h6">Mood</Typography>
                <Typography variant="h4">{healthData.mood || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
