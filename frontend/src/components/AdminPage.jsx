import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminPage() {
    const navigate = useNavigate();
    const[showAdminAddForm, setShowAdminAddForm] = useState(false);
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
            setShowEditDetails(false);
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
              setShowAdminAddForm(false);
              alert('Successfully added admin account');
              return await response.json();
              
        } catch (error) {
            console.log(error);
        }
            
    }

    
    const handleAdminAddClick = () => {
        setShowAdminAddForm(prevShowAdmin => !prevShowAdmin);
    }
    const[showEditDetails, setShowEditDetails] = useState(false);
    const handleEditForm = () =>{
        setShowEditDetails(prevShowForm => !prevShowForm);
    }

    const[adminList, setAdminList] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/adminList')
        .then(response => {
            if(!response.ok) {
                throw new Error('Error fetching admin list');
            }
            return response.json();
        })
        .then(data => {
            setAdminList(data.data);
        })
        .catch(err => console.error(err));
    }, []);

    const handleDeleteUser = async(admin_id) => {
        try{
            const response = await fetch(`http://localhost:5000/deleteAdmin/${admin_id}`, {
            method: 'DELETE',
            });
            if(!response.ok) {
                throw new Error('Error deleting');
            }

            const updatedList = adminList.filter(list => list.admin_id !== admin_id);
            setAdminList(updatedList);
        } catch(error) {
            console.log(error.message);
        }
        
    }
    return (
        <div className="admin-page">
            < div className='header'>
                <nav>
                    <div className="nav-logo">
                        <img src='/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg'
                        className='logo'/>
                    </div>
                    <div className="nav-home">
                        <button onClick={handleEditForm}>{showEditDetails ? 'Close' : 'Event Details'}</button>
                        <button onClick={handleAdminAddClick}>{showAdminAddForm ? 'Close' : 'Add'}</button>
                        <Link to='/'>Home</Link>
                    </div>
                </nav>
            </div>
            <div className="table-data">
                <div className="admin-table">
                <h2>Event Organisers Table</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminList.map(admin => (
                            <tr key={admin.admin_id}>
                                <td>{admin.admin_id}</td>
                                <td>{admin.admin_name}</td>
                                <td>{admin.admin_email}</td>
                                <td><button onClick={() => handleDeleteUser(admin.admin_id)}>Delete</button></td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
            </div>
            </div>
        
            {showAdminAddForm && (
                 <div className="modal" style={{ display: showAdminAddForm ? 'flex' : 'none' }}>
                    <div className="modal-content">
                    <button className="close-button" onClick={() => setShowAdminAddForm(false)}>
                    Close
                    </button>
                    <div className="add-user">
                        <form onSubmit={handleAddAdmin}>
                            <label>Name:</label>
                            <input type='name' value={name} onChange={handleNameChange} />
                            <label>Email:</label>
                            <input type='email' value={email} onChange={handleEmailChange} />
                            <br />
                            <label>Password:</label>
                            <input type='password' value={password} onChange={handlePasswordChange} />
                            <br />
                            <div className="modal-button">
                                <button type="submit">Add Organiser</button>
                            </div>
                        </form>
                    </div>
                    </div>
                 </div>
                 
             
            )
            }
            {showEditDetails && (
                <div className="modal" style={{ display: showEditDetails ? 'flex' : 'none' }}>
                    <div className="modal-content">
                    <button className="close-button" onClick={() => setShowEditDetails(false)}>
                    Close
                    </button>
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
                        <div className="modal-button">
                            <button type="submit">Save</button>
                        </div>
                        
                    </form>
                    </div>
                </div>
                
            
            )}
        </div>
    );
}

export default AdminPage;
