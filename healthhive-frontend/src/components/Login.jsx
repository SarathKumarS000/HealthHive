import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", credentials);
      dispatch(loginSuccess(response.data));
      navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Username"
          name="username"
          type="text"
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
