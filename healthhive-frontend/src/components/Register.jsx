import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axiosConfig from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosConfig.post('users/register', user);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Username" name="username" onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" onChange={handleChange} required />
        <Button type="submit" variant="contained">Sign Up</Button>
      </Box>
    </Container>
  );
};

export default Register;
