import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Slide,
  styled,
} from "@mui/material";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HotelIcon from "@mui/icons-material/Hotel";
import MoodIcon from "@mui/icons-material/Mood";
import { logHealthData } from "../services/apiService";
import { moodOptions } from "../utils/commons";
import { useSelector } from "react-redux";

// Styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 8,
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    "& fieldset": {
      borderColor: "#cfd8dc",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: 10,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cfd8dc",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

const HealthLog = () => {
  const user = useSelector((state) => state.auth.user);
  const [healthData, setHealthData] = useState({
    steps: "",
    calories: "",
    sleepHours: "",
    mood: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setHealthData({ ...healthData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { steps, calories, sleepHours } = healthData;

    if (steps < 0 || calories < 0 || sleepHours < 0) {
      setMessage({ type: "error", text: "Values cannot be negative." });
      return;
    }

    try {
      await logHealthData({ ...healthData, userId: user.id });
      setMessage({ type: "success", text: "Health data logged successfully!" });
      setHealthData({ steps: "", calories: "", sleepHours: "", mood: "" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to log health data." });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 5, mb: 4, fontWeight: 600 }}
      >
        Log Your Daily Health Data
      </Typography>

      <Slide in={!!message} direction="down" mountOnEnter unmountOnExit>
        <Alert
          severity={message?.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message?.text}
        </Alert>
      </Slide>

      <Card elevation={4} sx={{ borderRadius: 4, bgcolor: "#f0f4f8" }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Steps */}
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Steps Walked"
                  name="steps"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  value={healthData.steps}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsWalkIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Calories */}
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Calories Burned"
                  name="calories"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  value={healthData.calories}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalFireDepartmentIcon color="error" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Sleep Hours */}
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Sleep Hours"
                  name="sleepHours"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleChange}
                  value={healthData.sleepHours}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HotelIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Mood */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Mood</InputLabel>
                  <StyledSelect
                    name="mood"
                    value={healthData.mood}
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <MoodIcon color="action" />
                      </InputAdornment>
                    }
                    label="Mood"
                  >
                    {moodOptions.map((mood) => (
                      <MenuItem
                        key={mood.value}
                        value={mood.value}
                        sx={{
                          py: 1.5,
                          fontWeight: 500,
                          "&:hover": {
                            bgcolor: "#e3f2fd",
                          },
                        }}
                      >
                        {mood.key}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.7,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HealthLog;
