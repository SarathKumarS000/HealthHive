import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          HealthHive
        </Typography>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/insights">Community Insights</Button>
            <Button color="inherit" component={Link} to="/health-log">Health Log</Button>
            <Button color="inherit" component={Link} to="/resources">Resources</Button>
            <Button color="inherit" component={Link} to="/mental-health">Mental Health</Button>
            <Button color="inherit" component={Link} to="/emergency">Emergency</Button>
            <Button color="inherit" component={Link} to="/volunteer">Volunteer</Button>
            <Button color="inherit" component={Link} to="/challenges">Challenges</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
