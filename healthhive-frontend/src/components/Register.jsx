import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { registerUser } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(user);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
            fullWidth
            error={user.email && !/\S+@\S+\.\S+/.test(user.email)}
            helperText={
              user.email && !/\S+@\S+\.\S+/.test(user.email)
                ? "Invalid email format"
                : ""
            }
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={handleChange}
            required
            fullWidth
            helperText="Min 8 chars with uppercase, lowercase, number & special char"
            error={
              user.password &&
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                user.password
              )
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
