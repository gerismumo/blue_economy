import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await  fetch('http://localhost:5000/adminLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });
        if (!response.ok) {
            throw new Error('Network response was not okay');
          }
      
          const data = await response.json();
          alert(JSON.stringify(data.message)); 
          navigate ('/dashboard');
    } catch (error) {
        console.log(error);
    }
        
  };

  return (
    <div className="login-body">
        <div className='login'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <label>
            Email:
            <input type='email' value={email} onChange={handleEmailChange} />
            </label>
            <br />
            <label>
            Password:
            <input type='password' value={password} onChange={handlePasswordChange} />
            </label>
            <br />
            <button type='submit'>Login</button>
        </form>
        </div>
    </div>
    
  );
}

export default Login;
