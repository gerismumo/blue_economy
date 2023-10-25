import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/checkRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage('Email not found in the registration list.');
      }
    } catch (error) {
      setMessage('Error checking registration. Please try again.');
    }
  };

  return (
    <div>
      <h1>Check Registration</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter your email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Check Registration</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegistrationForm;
