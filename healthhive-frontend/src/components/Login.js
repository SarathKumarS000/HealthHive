import React, { useState } from "react";
import { Container, Typography, TextField, Button, Alert, Box } from "@mui/material";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", credentials);
      const { token, user } = response.data;

      // Store token & user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Username" name="username" type="text" onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" onChange={handleChange} required />
        <Button type="submit" variant="contained">Login</Button>
      </Box>
    </Container>
  );
};

export default Login;
