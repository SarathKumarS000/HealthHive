import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmergencySupport = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/emergency/contacts')
      .then(response => setEmergencyContacts(response.data))
      .catch(error => console.error('Error fetching emergency contacts', error));
  }, []);

  return (
    <div>
      <h2>Emergency Support</h2>
      <ul>
        {emergencyContacts.map((contact, index) => (
          <li key={index}>
            <strong>{contact.service}</strong>: {contact.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencySupport;
