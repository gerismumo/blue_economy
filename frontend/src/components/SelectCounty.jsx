import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';

function SelectCounty() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    const [selectedCounty, setSelectedCounty] = useState(null);
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    
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

          const handleSubmit = (event) => {
            event.preventDefault();
        
            const data = {
              selectedCounty: selectedCounty.value,
              areaOfInterest,
            };
            console.log('data',data);
            // Send the data to your backend using the Fetch API
            fetch(`${process.env.REACT_APP_API_URL}/api/submitData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Failed to submit data');
                }
              })
              .then((responseData) => {
                setSuccessMessage('Data submitted successfully');
                setErrorMessage('');
              })
              .catch((error) => {
                setSuccessMessage('');
                setErrorMessage('Error submitting data: ' + error.message);
              });
          };
  
    return (
        <div className="county-data">
            < div className='header'>
                        <nav>
                            <div className="header-logo">
                                <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" alt="logo" width="200px" 
                                        className="logo-image"
                                    />
                            </div>
                            <div className="links">
                              <button><Link to='/registration'>Back</Link></button>
                            </div>
                       </nav>     
                    </div>
            <div className="user-details">
                <div className="select-county">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="">Select County</label>
                        <Select
                        value={selectedCounty}
                        options={options}
                        onChange={handleCountyChange}
                        placeholder="Select a County"
                        />
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
            
            
        </div>
    )
}

export default SelectCounty;