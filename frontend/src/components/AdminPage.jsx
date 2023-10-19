import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let user = JSON.parse(localStorage.getItem('user'));
    const[showAdminAddForm, setShowAdminAddForm] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        about_event: '',
        event_date: '',
        event_time: '',
        event_location: ''
    });

    const event_detail_api = `${process.env.REACT_APP_API_URL}/api/eventDetails`;
    useEffect(() => {
        fetch(event_detail_api)
            .then(response => {
                if (!response.ok) {
                    toast.error('Error fetching event details');
                }
                return response.json();
            })
            .then(data => {
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setEventDetails(data.data[0]);
                } else {
                    toast.error('Error fetching event details');
                }
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, [event_detail_api]);

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
            const update_detail_api = `${process.env.REACT_APP_API_URL}/api/updateDetails`;
            const response = await fetch(update_detail_api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventDetails)
            });

            if (!response.ok) {
                toast.error('Error updating event details');
            }
            toast.success('Event details updated successfully');
            setTimeout(() => {
                setShowEditDetails(false);
                navigate('/');
            },3000);
            
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
            const add_admin_api = `${process.env.REACT_APP_API_URL}/api/addAdmin`;
            const response = await  fetch(add_admin_api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password,name}),
            });
            // if (!response.ok) {
            //     throw new Error('Network response was not okay');
            //   }

              const result = await response.json();

                if (result.success) {
                toast.success('Successfully added organiser');
                setTimeout(() => {
                    setShowAdminAddForm(false);
                },2000);
                const newAdmin = {
                    admin_id: result.data.insertId,
                    admin_name: name,
                    admin_email:email,
                };
    
                setAdminList(prevAdminList => [...prevAdminList, newAdmin]);
                } else {
                toast.error('User already exists');
                setTimeout(() => {
                    setShowAdminAddForm(false);
                },2000);
                }
            //   setShowAdminAddForm(false);
            //   toast.success('Successfully added account');
            //   return await response.json();
              
        } catch (error) {
            toast.error(error.message);
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
    const admin_list_api = `${process.env.REACT_APP_API_URL}/api/adminList`;
    useEffect(() => {

        if(user.organiser_role !== 'admin'){
            navigate('/login');
        }
        if(!user){
            navigate('/');
          }

        fetch(admin_list_api)
        .then(response => {
            if(!response.ok) {
                toast.error('Error fetching admin list');
            }
            return response.json();
        })
        .then(data => {
            setAdminList(data.data);
            setLoading(false);
        })
        .catch(error => {
            setError(error.message)
            setLoading(false);
        });
    }, [admin_list_api, navigate, user]);

    const handleDeleteUser = async(admin_id) => {
        try{
            const delete_admin_api = `${process.env.REACT_APP_API_URL}/api/deleteAdmin/${admin_id}`;
            const response = await fetch(delete_admin_api, {
            method: 'DELETE',
            });
            if(!response.ok) {
                toast.error('Error deleting');
            }

            const updatedList = adminList.filter(list => list.admin_id !== admin_id);
            setAdminList(updatedList);
            toast.success('Organiser deleted successfully');
        } catch(error) {
            toast.error(error.message);
        }
        
    }
    const logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((dropdownVisible) => !dropdownVisible);
    }

    
    return (
        <div>
            {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className="admin-page">
                    < div className='header'>
                        
                        <nav>
                            <div className="header-logo">
                                <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" alt="logo" width="200px" 
                                        className="logo-image"
                                    />
                            </div>
                            <div className="links">
                            
                            <div className="bigscreen">
                            {user ? (
                                        <>
                                        {user.organiser_role === 'admin' ?(
                                            <>
                                                <button><Link to='/'>Home</Link></button>
                                                <button><Link  to="/dashboard">Dashboard</Link></button>
                                                <button onClick={handleEditForm}>{showEditDetails ? 'Close' : 'Event Details'}</button>
                                                <button onClick={handleAdminAddClick}>{showAdminAddForm ? 'Close' : 'Add'}</button>    
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <button onClick={() =>logout()}>Logout</button>
                                        <div className="profile">
                                            <h3 style={{marginTop: '-5px'}}>{user.admin_name}</h3>
                                            <span style={{position: 'relative', fontSize: 'small', fontWeight:'700', marginTop:'-20px'}}>{user.organiser_role}</span>
                                        </div>
                                    </>
                                    ) : (
                                        <Link  to="/login">Login</Link>
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
                                                    <h3 style={{marginTop: '-10px'}}>{user.admin_name}</h3>
                                                    <span style={{position: 'relative', fontSize: 'small', fontWeight:'700'}}>{user.organiser_role}</span>
                                                </div>
                                                <button><Link to='/'>Home</Link></button>
                                                <button><Link  to="/dashboard">Dashboard</Link></button>
                                                <button onClick={handleEditForm}>{showEditDetails ? 'Close' : 'Event Details'}</button>
                                                <button onClick={handleAdminAddClick}>{showAdminAddForm ? 'Close' : 'Add Organiser'}</button>
                                                
                                                
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <button onClick={() =>logout()}>Logout</button>
                                    </>
                                    ) : (
                                        <Link  to="/login">Login</Link>
                                    )}
                        </div>)}
                    </div>
                    <ToastContainer />
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
                            <ToastContainer />
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
                            <ToastContainer />
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
                                <label>Time:</label>
                                    <input
                                    type="time"
                                    name="event_time"
                                    value={eventDetails.event_time}
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
            )}
        </div>
        
    );
}

export default AdminPage;
