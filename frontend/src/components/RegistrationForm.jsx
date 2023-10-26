import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const check_reg_api = `${process.env.REACT_APP_API_URL}/api/checkRegistration`
    try {
      const response = await fetch(check_reg_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if(data.success) {
          // setMessage(data.message);
          toast.success(data.message);
          setTimeout(() => {
            window.location.href = 'https://blueeconomysummit.co.ke/'; 
          }, 1000); 
        }else {
          setMessage(data.message);
        }
      } else {
        setMessage('Email not found in the registration list.');
      }
    } catch (error) {
      setMessage('Error checking registration. Please try again.');
    }
  };

  return (
    <div className='registration-page'>
      <ToastContainer/>
      <h1>Check Registration</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter your email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
