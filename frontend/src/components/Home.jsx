import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";


function Home() { 
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/register');
    }
    const API_URL = `${process.env.REACT_APP_API_URL}/api/usersList`;
    const[usersList, setUsersList] = useState([]);
    useEffect(() => {
        fetch(API_URL)
        .then(response => {
            if(!response.ok) {
                throw new Error('Failed to fetch persons list');
            }
            return response.json();
        })
        .then(data => {
            setUsersList(data.data)
        })
        .catch(error => {
            console.log(error.message);
        })
    }, [API_URL])
    const[eventDetails, setEventDetails] = useState([]);
    const Event_Detail_API = `${process.env.REACT_APP_API_URL}/api/eventDetails`;
    
    useEffect(() => {
        fetch(Event_Detail_API)
        .then(response => {
            if(!response.ok) {
                throw new Error('Error fetching event details');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                setEventDetails(data.data[0]);
              } else {
                console.log('Unexpected data format:', data);
              }
        })
        .catch(error => {
            console.log(error.message);
        })
    }, [Event_Detail_API]);
      
    const originalDate = eventDetails.event_date;
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
    });
    return (
        <div className="home">
           <div className="home-header">
                <nav>
                    <div className="header-logo">
                        <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" 
                                className="logo-image"
                            />
                    </div>
                    <div className="links">
                        <Link  to="/login">Login</Link>
                        <Link  to="/adminPage">Admin Page </Link>
                        <Link  to="/dashboard">Dashboard</Link>
                    </div>    
                </nav>
           </div>
           <div className="home-content">
                <div className="home-info">
                    <h1>About this event</h1>
                    <div className="home-info-text">
                        <p>
                        {eventDetails.about_event}
                        </p>
                        {/* <p>
                        The blue economy innovation and investment summit is a one week series of events that will seek to expand knowledge and opportunities that will foster growth of the blue economy. Growing the blue economy will open up opportunities for growth of new industries, innovation of new and improved technologies and open investment opportunities for entrepreneurs. The event is themed at unlocking the potential in the blue economy value chain which is at the heart of the coast region. With a series of events our participants will upskill and upscale through various sessions that will dissect different industries and upholding industry knowledge pillar of good ventures.
                        </p> */}
                    </div>
                </div>
                <div className="event-header">
                    <h2>Join us for the summit</h2>
                    <div className="event-info">
                    <div className="event-date">
                        <p>{formattedDate}</p>
                        <p>Location: {eventDetails.event_location}</p>
                    </div>
                    <div className="rsvp-persons">
                        <p>{usersList ? usersList.length : '0'} RSVP'd</p>
                        
                    </div>
                    <div className="register-button">
                        <button onClick={handleButtonClick}>RSVP Now</button>
                    </div>
                </div>
                </div>
                
           </div>
        </div>
    )
}

export default Home;