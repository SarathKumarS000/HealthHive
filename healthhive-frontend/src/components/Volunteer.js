import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Volunteer = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/volunteer')
      .then(response => setOpportunities(response.data))
      .catch(error => console.error('Error fetching volunteer opportunities', error));
  }, []);

  return (
    <div>
      <h2>Volunteer Opportunities</h2>
      <ul>
        {opportunities.map((opportunity, index) => (
          <li key={index}>
            <strong>{opportunity.title}</strong> - {opportunity.description}
            <br /> Location: {opportunity.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Volunteer;
