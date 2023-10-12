import React from "react";
import { useNavigate } from "react-router-dom";
function Home() { 
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/register');
    }
    return (
        <div className="home">
           <div className="home-header">
                <nav>
                    <div className="header-logo">
                        <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" 
                                className="logo-image"
                            />
                    </div>
                </nav>
           </div>
           <div className="home-content">
                <div className="home-info">
                    <h1>About this event</h1>
                    <div className="home-info-text">
                        <p>
                        The blue economy innovation and investment summit is a one week series of events that will seek to expand knowledge and opportunities that will foster growth of the blue economy. Growing the blue economy will open up opportunities for growth of new industries, innovation of new and improved technologies and open investment opportunities for entrepreneurs.
                            <br/>
                            <br/>
                        The event is themed at unlocking the potential in the blue economy value chain which is at the heart of the coast region. With a series of events our participants will upskill and upscale through various sessions that will dissect different industries and upholding industry knowledge pillar of good ventures.
                        </p>
                    </div>
                </div>
                <div className="event-header">
                    <h2>Join us for the summit</h2>
                    <div className="event-info">
                    <div className="event-date">
                        <p>October 25, 2023</p>
                    </div>
                    <div className="rsvp-persons">
                        <p>10 RSVP'd</p>
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