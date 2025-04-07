import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HealthChallenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/health-challenges')
      .then(response => setChallenges(response.data))
      .catch(error => console.error('Error fetching challenges', error));
  }, []);

  return (
    <div>
      <h2>Health Challenges</h2>
      <ul>
        {challenges.map((challenge, index) => (
          <li key={index}>
            <strong>{challenge.name}</strong> - {challenge.goal}
            <br /> Duration: {challenge.duration} days
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthChallenges;
