import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const HealthResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/health-resources')
      .then(response => setResources(response.data))
      .catch(error => console.error('Error fetching health resources', error));
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: 3 }}>Local Health Resources</Typography>
      <List sx={{ marginTop: 2 }}>
        {resources.map((resource, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText 
                primary={resource.name} 
                secondary={`${resource.type} | ${resource.address} | ${resource.contact}`} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default HealthResources;
