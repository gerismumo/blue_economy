import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Home() { 
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    let user = JSON.parse(localStorage.getItem('user'));
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
            throw(error.message);
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
                setLoading(false);
              } else {
                console.log('Unexpected data format:', data);
              }
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        })
    }, [Event_Detail_API]);
      
    const originalDate = eventDetails.event_date;
    const formattedDate = new Date(originalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
    });

   
    const logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }
    // useEffect(() => {
    //     if(user.organiser_role != 'admin'){
    //       navigate('/login');
    //    }
    //    if(!user){
    //     navigate('/');
    //   }
    //   }, navigate);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((dropdownVisible) => !dropdownVisible);
    }
    
    const formatTime = (timeString) => {
        const date = new Date(`2000-01-01T${timeString}`);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour format to 12-hour format
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    
        // Pad single-digit minutes with leading zero
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${displayHours}:${displayMinutes} ${ampm}`;
      };
      
    return (
        <div>
            {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className="home">
                <div className="home-header">
                     <nav>
                         <div className="header-logo">
                             <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" 
                                     className="logo-image"
                                 />
                         </div>
                         <div className="links">
                         
                         <div className="bigscreen">
                         {user ? (
                                     <>
                                     {user.organiser_role === 'admin' ?(
                                         <>
                                             <Link  to="/adminPage">Admin Page </Link>
                                             
                                         </>
                                     ) : (
                                         <></>
                                     )}
                                     
                                     <div className="profile">
                                         <h3 style={{marginTop: '-5px'}}>{user.admin_name}</h3>
                                         <span style={{position: 'relative', fontSize: 'small', fontWeight:'700', marginTop:'-20px'}}>{user.organiser_role}</span>
                                     </div>
                                     <Link  to="/dashboard">Dashboard</Link>
                                     <button onClick={() =>logout()}>Logout</button>
                                 </>
                                 ) : (
                                    <>
                                    <Link to="/confirmAttend">Scan Me</Link>
                                     <Link  to="/login">Login</Link>
                                    </>
                                 )}
                         </div>
                         <div className="dropdown" onClick={toggleDropdown}>
                             {dropdownVisible ? 'Close' : 'Menu'}
                         </div>
     
                         </div>
                     </nav>
                     {dropdownVisible && (
                     <div className="dropdown-content" onClick={toggleDropdown}>
                         {user ? (
                                     <>
                                     {user.organiser_role === 'admin' ?(
                                         <>
                                             <div className="profile-icon">
                                                 <h3 style={{marginTop: '-5px'}}>{user.admin_name}</h3>
                                                 <span style={{position: 'relative', fontSize: 'small', fontWeight:'700'}}>{user.organiser_role}</span>
                                             </div>
                                             <Link  to="/adminPage">Admin Page </Link>
                                             
                                         </>
                                     ) : (
                                         <></>
                                     )}
                                     
                                     <Link  to="/dashboard">Dashboard</Link>
                                     <button onClick={() =>logout()}>Logout</button>
                                 </>
                         ) : (
                            <>
                            
                            <Link  to="/login">Login</Link>
                            <Link to="/confirmAttend">Scan Me</Link>
                            </>
                          
                         )}
                     </div>)}
                <div className="home-content">
                     <div className="home-info">
                         <h1>About this event</h1>
                         <div className="home-info-text">
                             <p>
                             {eventDetails.about_event? eventDetails.about_event : <p>loading...</p>}
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
                             <p>Time: {formatTime(eventDetails.event_time)}</p>
                             <p>Location: {eventDetails.event_location}</p>
                         </div>
                         
                         <div className="register-button">
                             <div className="rsvp-persons">
                                 <p>{usersList ? usersList.length : '0'} RSVP'd</p>
                                 
                             </div>
                             <button onClick={handleButtonClick}>RSVP Now</button>
                         </div>
                     </div>
                     </div>
                     
                </div>
                 </div>
             </div>
            )}
        </div>
        
    )
}

export default Home;