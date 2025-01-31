import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [openSelectForm, setOpenForm] = useState(false);
  const [closeSelectForm, setCloseForm] = useState(true);
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
        const emailCheck = await response.json();
        // console.log('emailCheck', emailCheck);
        if(emailCheck.success) {
          // setMessage(data.message);
          toast.success(emailCheck.message);
          setCloseForm(false);
          setOpenForm(true);
          // setTimeout(() => {
          //   window.location.href = 'https://blueeconomysummit.co.ke/'; 
          // }, 1000); 
          // setTimeout(() => {
          //   navigate('/selectCounty')
          // },1000);
        }else {
          setMessage(emailCheck.message);
        }
      } else {
        setMessage('Email not found in the registration list.');
      }
    } catch (error) {
      setMessage('Error checking registration. Please try again.');
    }
  };


  //some data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)
  const [selectedCounty, setSelectedCounty] = useState(null);
const [areaOfInterest, setAreaOfInterest] = useState('');
  
  const[countyList, setCountyList] = useState([]);
  const County_API = `${process.env.REACT_APP_API_URL}/api/counties`;
  
  useEffect(() => {
      fetch(County_API)
      .then(response => {
          if(!response.ok) {
              throw new Error('Error fetching event details');
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              setCountyList(data.data);
              setLoading(false);
            } else {
              console.log('Unexpected data format:', data);
            }
      })
      .catch(error => {
          setError(error.message);
          setLoading(false);
      })
  }, [County_API]);

  // console.log('countyList',countyList.length);
 
      const options = countyList.map((county) => ({
        value: county.name,
        label: county.name,
      }));

      const handleCountyChange = (selectedOption) => {
          setSelectedCounty(selectedOption);
        };
      
        const handleAreaOfInterestChange = (event) => {
          setAreaOfInterest(event.target.value);
        };

        const handleSubmit = async (event) => {
          event.preventDefault();
        
          const data = {
            selectedCounty: selectedCounty.value,
            areaOfInterest,
            email
          };
          // console.log('data',data, email);
          // Send the data to your backend using the Fetch API
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/updateSubmit`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if(response.ok) {
              const data = await response.json();
              if(data.success) {
                setTimeout(() => {
                  window.location.href = 'https://blueeconomysummit.co.ke/'; 
                }, 1000); 
              } else {
                toast.error('Error occurred');
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
          

  return (
    <div>
          <div className='registration-page'>
          < div className='header'>
                            <nav>
                                <div className="header-logo">
                                    <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" alt="logo" width="200px" 
                                            className="logo-image"
                                        />
                                </div>
                           </nav>     
          </div>
          <ToastContainer/>
          <div className="register-details">
          {closeSelectForm && (
            <>
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
            </>
            
          )}
          
            {openSelectForm && (
              <div className="user-details">
              <div className="select-county">
                  <form onSubmit={handleSubmit}>
                      <label htmlFor="">Select County</label>
                      <div className="county">
                        <Select
                        value={selectedCounty}
                        options={options}
                        onChange={handleCountyChange}
                        placeholder="Select a County"
                        />
                      </div>
                      
                      <label htmlFor="">Which areas are of interest to you during the summit?</label>
                      <select 
                          id="interests-area"
                          name="areaOfInterests"
                          value={areaOfInterest}
                          onChange={handleAreaOfInterestChange}
                      >
                          <option value=""></option>
                          <option value="blue economy">Blue Economy</option>
                          <option value="climate change">Climate Change</option>
                          <option value="digital economy">Digital Economy</option>
                          <option value="circular economy">Circular economy</option>
                          <option value="cybersecurity ">Cybersecurity </option>
                          <option value="all if possible">All if Possible</option>
                      </select>
                      <button type="submit">Submit</button>
                  </form>
                  
              </div>
          </div>
            )}
          </div>
          
        </div>
      
    </div>
  )

}

export default RegistrationForm;
