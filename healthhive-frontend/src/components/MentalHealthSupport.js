import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const MentalHealthSupport = () => {
  const [mood, setMood] = useState('');
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/mental-health/resources')
      .then(response => setResources(response.data))
      .catch(error => console.error('Error fetching mental health resources', error));
  }, []);

  const submitMoodCheck = async () => {
    try {
      await axios.post('http://localhost:8080/api/mental-health/check-in', { mood });
      alert('Mood check-in recorded!');
    } catch (error) {
      console.error('Error submitting mood check-in', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: 3 }}>Mental Health Support</Typography>
      
      <TextField 
        label="Mood Check-in" 
        fullWidth 
        variant="outlined" 
        sx={{ marginTop: 2 }}
        value={mood} 
        onChange={(e) => setMood(e.target.value)} 
      />
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={submitMoodCheck}>
        Submit Mood
      </Button>

      <Typography variant="h5" sx={{ marginTop: 4 }}>Resources</Typography>
      <List>
        {resources.map((resource, index) => (
          <ListItem key={index}>
            <ListItemText primary={resource.title} secondary={resource.link} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default MentalHealthSupport;
