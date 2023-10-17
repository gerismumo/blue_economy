import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
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

  const[adminList, setAdminList] = useState([]);
  const admin_list_api = `${process.env.REACT_APP_API_URL}/api/adminList`;
    useEffect(() => {
        fetch(admin_list_api)
        .then(response => {
            if(!response.ok) {
                toast.error('Error fetching admin list');
            }
            return response.json();
        })
        .then(data => {
            setAdminList(data.data);
        })
        .catch(err => toast.error(err.message));
    }, [admin_list_api]);
    // console.log('admilist',adminList);

    // for(const admin of adminList) {
    //   console.log(admin.admin_email)
    //   console.log(admin.organiser_role)
    // }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const admin_login_api = `${process.env.REACT_APP_API_URL}/api/adminLogin`;
        const response = await  fetch(admin_login_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });
        if (!response.ok) {
            toast.error('Invalid credentials');
          }
      
          const data = await response.json();
        
          if (data.success) {
            
            localStorage.setItem('user', JSON.stringify(data.adminData));
           
            let user = JSON.parse(localStorage.getItem('user'));
            console.log('user',user);
            const isAdmin = adminList.some((admin) => {
                      return (admin.admin_email === email && admin.organiser_role === 'organiser') || (admin.admin_email === email && admin.organiser_role === 'admin') ;
                        });
      
            if (isAdmin) {
              setAuthenticated(true);
              toast.success('Successfully logged in');
              setTimeout(() => {
                if(user.organiser_role==='admin') {
                  navigate('/adminPage');
                } else {
                  navigate('/dashboard');
                }
                
              },3000)
              
            } else {
              toast.error('Invalid email or role');
            }
          }
          return;
           
    } catch (error) {
        throw(error);
    }
        
  };

 
  return (
    <div>
        <div className="login-body">
          <ToastContainer />
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
