import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({
        about_event: '',
        event_date: '',
        event_location: ''
    });

    useEffect(() => {
        fetch('http://localhost:5000/eventDetails')
            .then(response => {
                if (!response.ok) {
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
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails({
            ...eventDetails,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/updateDetails', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventDetails)
            });

            if (!response.ok) {
                throw new Error('Error updating event details');
            }
            navigate('/');
        } catch (error) {
            console.error(error.message);
        }
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleAddAdmin = async(e) => {
        e.preventDefault();
        try {
            const response = await  fetch('http://localhost:5000/addAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password,name}),
            });
            if (!response.ok) {
                throw new Error('Network response was not okay');
              }
              alert('Successfully added admin account');
              return await response.json();
        } catch (error) {
            console.log(error);
        }
            
    }

    return (
        <div className="admin-page">
        <div className="home-detail">
        <form onSubmit={handleSubmit}>
                <label>About this event:</label>
                <textarea
                    name="about_event"
                    value={eventDetails.about_event}
                    onChange={handleInputChange}
                />
                <label>Date:</label>
                <input
                    type="date"
                    name="event_date"
                    value={eventDetails.event_date}
                    onChange={handleInputChange}
                />
                <label>RSVPs:</label>
                <input
                    type="text"
                    name="event_location"
                    value={eventDetails.event_location}
                    onChange={handleInputChange}
                />
                <button type="submit">Save</button>
            </form>
        </div>
            <div className="add-user">
                <form onSubmit={handleAddAdmin}>
                    <label>
                    Name:
                    <input type='name' value={name} onChange={handleNameChange} />
                    </label>
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
                    <button type='submit'>Add Admin</button>
                </form>
            </div>
        </div>
    );
}

export default AdminPage;
