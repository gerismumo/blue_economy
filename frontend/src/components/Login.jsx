import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../utils/ProtectedRoute';

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
          setAuthenticated(true);
          navigate ('/dashboard');
    } catch (error) {
        console.log(error);
    }
        
  };

  return (
    <div>
        <div className="login-body">
          <div className="header">
            <nav>
                    <div className="header-logo">
                        <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" 
                                className="logo-image"
                            />
                    </div>
                </nav>
          </div>
                
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
    </div>
    
  
  );
}

export default Login;
