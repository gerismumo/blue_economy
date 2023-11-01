import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { setAuthenticated } from '../utils/ProtectedRoute';

function CyberSec() {
const navigate = useNavigate();
    // const [importedData, setImportedData] = useState(null);
    const[usersList, setUsersList] = useState([]);
    let person = JSON.parse(localStorage.getItem('user'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const[errorMessages, setErrorMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[isDropDown, setDropDown] = useState(false);


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
                } else {
                  console.log('Unexpected data format:', data);
                }
          })
          .catch(error => {
              console.log(error.message);
          })
      }, [County_API]);

      const options = countyList.map((county) => ({
        value: county.name,
        label: county.name,
      }));
      const [selectedCounty, setSelectedCounty] = useState(null);
      const handleCountyChange = (selectedOption) => {
        setSelectedCounty(selectedOption);
      };
    

      //handle search 
      const[searchQuery, setSearchQuery] = useState('');
      const handleSearch = (event) => {
        setSearchQuery(event.target.value);
      }

      const filteredData = usersList
        ? usersList.filter((user) => {
          
            return (
                (user.attendee_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
                // user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.portifolio_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.submitted_project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.project_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.attendee_county.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.attendee_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.college_uni.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.job_speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.registered_at.toString().toLowerCase().includes(searchQuery.toLowerCase())  ||  
                // user.team_mates.toLowerCase().includes(searchQuery.toLowerCase())  ||
                // user.heard_where.toLowerCase().includes(searchQuery.toLowerCase())  ||
                user.company.toLowerCase().includes(searchQuery.toLowerCase())  ||
                user.phone_number.toLowerCase().includes(searchQuery.toLowerCase())  
            );
            })
        : []
        //get users list 

        const User_List_Api = `${process.env.REACT_APP_API_URL}/api/cyberSecurityList`;
        useEffect(() => {
            fetch(User_List_Api)
            .then(response => {
                if(!response.ok) {
                    throw new Error('Failed to fetch persons list');
                }
                return response.json();
            })
            .then(data => {
                setUsersList(data.data)
                setLoading(false);
                setAuthenticated(true);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            })
        }, [User_List_Api]);
       
        //handle delete user

        
        const handleDeleteUser = async(attendee_id) => {
            try {
                const delete_user_api = `${process.env.REACT_APP_API_URL}/api/deleteUserCyber/${attendee_id}`
                const response = await fetch(delete_user_api, {
                method: 'DELETE',  
                })
                if(response.ok) {
                    const updatedUsersList = usersList.filter((user) => attendee_id !== user.attendee_id);
                    setUsersList(updatedUsersList);
                    toast.success('Successfully deleted');
                }
            } catch (error) {
                throw(error);
            }
        }

        //handle edit 
        
        const handleEditUser = (user) => {
            if(user) {
                setEditingUser(user);
                setIsModalOpen(true);
                console.log('editingUser',editingUser)
            }  
        }
        const handleChangesCounty = (selectedOption) => {
            setEditingUser((prevEditingUser) => ({
              ...prevEditingUser,
              attendee_county: selectedOption.value,
            }));
          };

        // const hearAboutEventValues = editingUser ? editingUser.hear_about_event.split(',') : [];
        const handleChanges = (event) => {
            const { name, value } = event.target;
            setEditingUser((prevEditingUser) => ({
              ...prevEditingUser,
              [name]: value,
            }));
          }
        //   const handleCheckboxChange = (event) => {
        //     const checkboxValue = event.target.value;
        //     const isChecked = event.target.checked;
          
        //     setEditingUser((prevEditingUser) => {
        //       let updatedHearAboutEvent = [...hearAboutEventValues];
          
        //       if (isChecked) {
        //         updatedHearAboutEvent.push(checkboxValue);
        //       } else {
        //         updatedHearAboutEvent = updatedHearAboutEvent.filter(
        //           (value) => value !== checkboxValue
        //         );
        //       }
          
        //       return {
        //         ...prevEditingUser,
        //         hear_about_event: updatedHearAboutEvent.join(','),
        //       };
        //     });
        //   };

          //submit edit data
          const handleSubmitEditData = async(e) => {
            e.preventDefault();
                try {
                    if(!editingUser || !editingUser.attendee_id) {
                        console.log('Invalid editing user data or user_id');
                        return;
                    }
                    const API_URL = `${process.env.REACT_APP_API_URL}/api/editUserCyber/${editingUser.attendee_id}`
                    const response = await fetch(API_URL, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editingUser),
                    });
                    if(response.ok) {
                        toast.success('Successfully updated');
                        setTimeout(() => {
                            setIsModalOpen(false);
                        }, 2000)
                        setUsersList(prevAdminList => {
                            const updatedUsersList = prevAdminList.map(user => {
                                if (user.attendee_id=== editingUser.attendee_id) {
                                    return {
                                        ...user,
                                        full_name: editingUser.full_name,
                                        email: editingUser.email,
                                        attendee_county: editingUser.attendee_county,
                                        company: editingUser.company,
                                        phone_number: editingUser.phone_number,
                                        attendee_interest: editingUser.attendee_interest,
                                        
                                    };
                                }
                                return user;
                            });
                            return updatedUsersList;
                        });
                        // window.location.reload();
                    } else {
                        toast.success('Error updating');
                    }        
                } catch (error) {
                    toast.error(error.message);
                }
            
          }

          const[isAddFormOpen, setAddFormOpen] = useState(false);
          //add new user
          const handleAddNewUser = () => {
            setAddFormOpen(true);
            setDropDown(false);
          }

        //   if(setAddFormOpen) {
        //     const span = document.getElementsByTagName('span');
        //             Array.from(span).forEach(span => {
        //                 span.style.display = 'none';
        //             });
        //   }

          const[formData, setFormData] = useState({
            fullname: '',
            email: '',
            company:'',
            phoneNumber:'',
            areaOfInterests:'',
        })
    
        
        
        const handleChange = (e) => {
            const {name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value,
    
            })
        
        }
    
        // const [checkedBoxes, setCheckedBoxes] = useState([]);

        //     const handleCheckboxClick = (event) => {
        //         const { value } = event.target;
        //         setCheckedBoxes((prevCheckedBoxes) => {
        //         if (prevCheckedBoxes.includes(value)) {
        //             return prevCheckedBoxes.filter((item) => item !== value);
        //         } else {
        //             return [...prevCheckedBoxes, value];
        //         }
        //         });
        //     };

            const resetFormFields = () => {
                setFormData({
                    fullname: '',
                    email: '',
                    company:'',
                    phoneNumber:'',
                }); 
            }

            const handleSubmit = async(e) => {
                e.preventDefault();
               
                const errors = {};
                // if(!formData.firstname) {
                //     errors.firstname = 'Please enter first Name'
                // }
                // if(!formData.lastname) {
                //     errors.lastname = 'Please enter lastname'
                // }
                if(!formData.fullname) {
                    errors.fullname = 'Please enter your Full Name'
                }
                if(!formData.email) {
                    errors.email = 'Please enter a valid email'
                }
                // if(!formData.submitProject) {
                //     errors.submitProject = 'Please select an option'
                // }
                // if(!formData.city) {
                //     errors.city = 'Please enter City name'
                // }
                // if(!formData.state) {
                //     errors.state = 'Please enter State name';
                // }
                // if(!formData.country) {
                //     errors.country = 'Please enter country name';
                // }
                // if(!formData.county) {
                //     errors.county = 'Please enter county name';
                // }
                // if(!formData.JoinAs) {
                //     errors.JoinAs = 'Please select an option';
                // }
                // if(!formData.phoneNumber) {
                //     errors.phoneNumber = 'Please enter a phone number';
                // }
                
                const requestData = {
                    fullname: formData.fullname,
                    email: formData.email,
                    company: formData.company,
                    county: selectedCounty.value,
                    phoneNumber: formData.phoneNumber,
                    areaOfInterests: formData.areaOfInterests, 
                  };
                  console.log('requestData',requestData)
                  const Register_User_Api = `${process.env.REACT_APP_API_URL}/api/registerUsersCyber`;
                  fetch(Register_User_Api, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(requestData),
                })
                .then(response => response.json())
                .then(result => {
                    if (result && result.success) {
                        toast.success('Registration was successfully registered');
                        console.log('result', result.data.insertId);
                        setTimeout(() => {
                            setAddFormOpen(false);
                        }, 1000);
                        const newAttendee = {
                            attendee_id : result.data.insertId,
                            full_name: requestData.fullname,
                            email:requestData.email,
                            company:requestData.company,
                            attendee_county: requestData.county,
                            phone_number: requestData.phoneNumber,
                            attendee_interest: requestData.areaOfInterests,
                        }
                        setUsersList(prevList => [...prevList, newAttendee]);
                    } else {
                        toast.error('Email already exists'); 
                        setTimeout(() => {
                            setAddFormOpen(false);
                        }, 1000);
                    }
                    resetFormFields();
                    // document.getElementById('submit-project').selectedIndex = 0;
                    // document.getElementById('team-select').selectedIndex = 0;
                    // document.getElementById('heard-select').selectedIndex = 0;    
                })
                  .catch ((error) => {
                    throw(error);
                  });
            }
            const [attendedStatuses, setAttendedStatuses] = useState({});
            const fetchInitialAttendStatuses = async () => {
                try {
                    const attend_status_api = `${process.env.REACT_APP_API_URL}/api/attendStatusCyber`;
                  const response = await fetch(attend_status_api);
                  if (!response.ok) {
                    throw new Error('Failed to fetch initial attendance status from the database');
                  }
                  const data = await response.json();
                  // Assuming the data is returned in the format { userId1: true, userId2: false, ... }
                  setAttendedStatuses(data.data);
                } catch (error) {
                  throw('Error fetching initial attendance status:', error);
                }
              };
              
              useEffect(() => {
                // Fetch and set the initial attendedStatuses when the component mounts
                fetchInitialAttendStatuses();
              }, []);
            //   console.log('attendedStatuses',attendedStatuses);
            

            async function handleCheckboxConfirm(event) {
                const userId = event.target.name;
                const attendedStatus = event.target.checked;

                setAttendedStatuses({
                ...attendedStatuses,
                [userId]: attendedStatus
                });
                
                try {
                    const attend_status_ap = `${process.env.REACT_APP_API_URL}/api/attendedStatusesCyber`;
                    const response = await fetch(attend_status_ap, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ userId, attendedStatus }),
                    });
                
                    if (!response.ok) {
                      throw new Error('Failed to update attendance status in the database');
                    }
                    toast.success('Successfully updated');
                  } catch (error) {
                    toast.error(error.message);
                  }
            }

    //export to excel
    function formatConfirmedAt(dateTimeString) {
        if (!dateTimeString) {
          return '';
        }
      
        const date = new Date(dateTimeString);
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
      
        return date.toLocaleString('en-US', options);
      }


    const exportToExcel = () => {
        const dataToExport = filteredData.map((user) => ({
          'Full Names': user.full_name,
          'Company/Organization Name': user.company,
          'Email Address': user.email,
          'Phone number( For communication purposes only)': user.phone_number,
          'County of Residence': user.attendee_county,
          'Which areas are of interest to you during the summit?': user.attendee_interest,
          'Attended': attendedStatuses[user.attendee_id] ? 'Yes' : 'No',
          'Confirmed At': formatConfirmedAt(user.confirmed_at),
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');
        XLSX.writeFile(workbook, 'cybersecurity_data.xlsx');
      };
   
      const logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }
    useEffect(() => {
       if(!person){
        navigate('/');
      }
      }, [navigate, person]);
    //   const [dropdownVisible, setDropdownVisible] = useState(false);

    //   const toggleDropdown = () => {
    //       setDropdownVisible((dropdownVisible) => !dropdownVisible);
    //   }

    //file import 

    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

      const handleFileUpload = async (e) => {
        e.preventDefault();
    
        const upload_file_api = `${process.env.REACT_APP_API_URL}/api/uploadCyberFile`;
        try {
          // Parse the Excel file to JSON before sending it to the server
          parseExcelFile(file, (jsonData) => {
            console.log(jsonData);
            // Send the JSON data to the server using the fetch API
            fetch(upload_file_api, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(jsonData),
            })
              .then((response) => {
                if (response.status === 200) {
                    
                  console.log('File uploaded successfully.');
                  window.location.reload();
                } else {
                  console.error('Error uploading the file.');
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          });
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
      const parseExcelFile = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          callback(jsonData);
        };
        reader.readAsArrayBuffer(file);
      };

      
      
      const toggleDropdown = () => {
        setDropDown((isDropDown) => !isDropDown);
      }

      const handlePageSelect = (event) => {
        const targetLink = event.target.value;
        if(targetLink) {
            return navigate(targetLink);
        }
      }

    return (
        <div>
            {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className="dashboard">
                < div className='header'>
                <nav>
                    <div className="nav-logo">
                        <img src='/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg' alt='logo'
                        className='logo'/>
                    </div>
                    <div className="nav-home">
                        <Link to='/'>Home</Link>
                        <button onClick={logout}>Logout</button>
                    </div>
                </nav>
            </div>
            <div className="dashboard-tabs">
                <div className="search-tab">
                    <input type="text" 
                        name='search'
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder='search'
                    />
                    <div className="no-users">
                        <p>{usersList ? usersList.length : '0'}</p>
                        <p>registered attendees</p>
                    </div>
                </div>
                <div className="middle-tabs">
                    <div className='button-tabs'>
                        <select onChange={handlePageSelect}>
                            <option value="">Select Dashboard</option>
                            <option value="/dashboard">Dashboard</option>
                        </select>
                        {person.organiser_role === 'admin'? (
                            <>
                                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                                <button onClick={handleFileUpload}>Upload</button>
                            </>
                        ): (
                            <></>
                        )}
                        
                    </div>
                    <div className='button-tabs'>
                        <button onClick={exportToExcel}>Export to Excel</button>
                        {/* <button>Clear Table</button> */}
                    </div>
                    <div className="add-user" onClick={handleAddNewUser}>
                        <div className="add-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="add-text">
                            <p>add attendee</p>
                        </div>
                    </div>
                </div>
                <div className="dropdown-bar" onClick={toggleDropdown}>
                             {isDropDown ? 'Close' : 'Menu'}
                </div>
            </div>
            {isDropDown && (
                <div className="dropdown-menu">
                    <div className="menu-tabs">
                        <select onChange={handlePageSelect}>
                            <option value="">Select Dashboard</option>
                            <option value="/dashboard">Main Summit</option>
                        </select>
                            {person.organiser_role === 'admin'? (
                                <>
                                    <input type="file" accept=".xlsx" onChange={handleFileChange} />
                                    <button onClick={handleFileUpload}>Upload</button> 
                                </>
                            ): (
                                <></>
                            )}
                            <button onClick={exportToExcel}>Export to Excel</button>
                            <p onClick={handleAddNewUser} >add Attendee</p>
                    </div>    
                </div>
            )}
            <ToastContainer />
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Attend Status</th>
                            <th>Attended</th>
                            <th>Confirmed At</th>
                            <th>County</th>
                            <th>Which areas are of interest to you during the summit?</th>
                            <th>Attendee ID</th>
                            {/* <th>First Name</th>
                            <th>Last Name</th> */}
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Company/ Organization Name</th>
                            <th>Phone number(For communication purposes only)</th>
                            {/* <th>Portfolio Url</th>
                            <th>Submitted Project?</th>
                            <th>Project URLs</th> */}
                            {/* <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Project Count</th>
                            <th>College/University Name</th>
                            <th>Job Specialty</th> */}
                            {/* <th>Registered At</th> */}
                            {/* <th>Do you have teammates?</th>
                            <th>Who told you about this hackathon?</th>
                            <th>County of Residence</th>
                            <th>Phone number( For communication purposes only)</th> */}
                            {/* <th>Edit</th>
                            <th>Delete</th> */}
                        </tr>
                    </thead>
                    <tbody>
                    {filteredData.length === 0 ? (
                        <p>no available data</p>
                    ): (
                        filteredData.map(user => (
                            <tr key={user.attendee_id}>
                                <td><input type="checkbox"
                                 className='confirm-check'
                                  name={user.attendee_id} 
                                  checked={attendedStatuses[user.attendee_id]} 
                                  onChange={handleCheckboxConfirm} 
                                  /></td>
                                  <td className='attend-text'>{attendedStatuses[user.attendee_id] ? 'Yes' : 'No'}</td>
                                  <td>{formatConfirmedAt(user.confirmed_at)}</td>
                                  <td>{user.attendee_county ? (user.attendee_county):('')}</td>
                                  <td>{user.attendee_interest ?(user.attendee_interest):('')}</td>
                                <td>{user.attendee_id}</td>
                                {/* <td>{user.first_name}</td>
                                <td>{user.last_name}</td> */}
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                {/* <td>{user.portifolio_url}</td>
                                <td>{user.submitted_project}</td>
                                <td>{user.project_url}</td>
                                <td>{user.city}</td>
                                <td>{user.state}</td>
                                <td>{user.country}</td>
                                <td>{user.project_count}</td>
                                <td>{user.college_uni}</td>
                                <td>{user.job_speciality}</td> */}
                                {/* <td>{user.registered_at}</td> */}
                                {/* <td>{user.team_mates}</td>
                                <td>{user.heard_where}</td>
                                <td>{user.county}</td> */}
                                 <td>{user.company}</td>
                                <td>{user.phone_number}</td>
                                {/* <td><button onClick={()=>handleEditUser(user)}>Edit</button></td> */}
                                <td><button onClick={()=>handleEditUser(user)}>Edit</button></td>
                                {person ? (
                                    <>
                                    {person.organiser_role === 'admin'? (
                                        <>
                                         <td><button onClick={()=>handleDeleteUser(user.attendee_id)}>Delete</button></td>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    </>
                                ) : (
                                    <></>
                                )}
                                
                                
                            </tr>
                        ))
                    )}
                </tbody>
                </table> 
            </div>

            {isModalOpen && editingUser && (
            <div className="modal" style={{ display: isModalOpen ? 'flex' : 'none' }}>
                 <ToastContainer />
            <div className="modal-content">
                <button className="close-button" onClick={() => setIsModalOpen(false)}>
                Close
                </button>
                {/* Place your form code here */}
                <form onSubmit={handleSubmitEditData}>
                        <label htmlFor="email"  >Email</label>
                        <input 
                        type='email' 
                        placeholder='johndoe@gmail.com' 
                        name='user_email'
                        value={editingUser.email}
                        onChange={handleChanges}
                        />
                        <label htmlFor="name">Full name</label>
                        <input type='text'
                        name='user_name'
                        placeholder='John Doe' 
                        value={editingUser.full_name}
                        onChange={handleChanges}
                        />
                        <label htmlFor="company">Company/Organisation</label>
                        <input type='text'
                        name='company'
                        value={editingUser.company}
                        onChange={handleChanges}
                        />
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="tel" 
                        name='phone_number'
                        value={editingUser.phone_number}
                        onChange={handleChanges}
                        />
                        <Select
                            value={{ value: editingUser.attendee_county, label: editingUser.attendee_county }}
                            options={options}
                            onChange={handleChangesCounty}
                            placeholder="Select a County"
                            />
                             <label htmlFor="form">Which areas are of interest to you during the summit?</label>
                        <select name="user_interest" id="interests-area" value={editingUser.user_interest} onChange={handleChanges}>
                            <option value="blue economy">Blue Economy</option>
                            <option value="climate change">Climate Change</option>
                            <option value="digital economy">Digital Economy</option>
                            <option value="circular economy">Circular economy</option>
                            <option value="cybersecurity ">Cybersecurity </option>
                            <option value="all if possible">All if Possible</option>
                        </select>
                        
                        <div className="modal-button">
                            <button type='submit'>Submit</button>
                        </div> 
                </form>
            </div>
            </div>
        )}

        {isAddFormOpen  && (
                    <div className="modal" style={{ display: isAddFormOpen ? 'flex' : 'none' }}>
                        <ToastContainer />
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setAddFormOpen(false)}>
                        Close
                        </button>
                       
                        <form onSubmit={handleSubmit}>
                     <label htmlFor="fullname">Full name</label>
                    <span>{errorMessages.fullname}</span>
                    <input type='text'
                    name='fullname'
                     value={formData.fullname}
                     placeholder='John Doe' 
                     onChange={handleChange}/>
                    <label htmlFor="email"  >Email</label>
                    <span>{errorMessages.email}</span>
                    <input 
                    type='email' 
                    placeholder='johndoe@gmail.com' 
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    />
                    <label htmlFor="company">Company/Organisation</label>
                    <span>{errorMessages.company}</span>
                    <input type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    />
                     <label htmlFor="projecturls">Phone number( For communication purposes only)</label>
                    <span>{errorMessages.phoneNumber}</span>
                    <input type='text'
                    name='phoneNumber'
                     value={formData.phoneNumber}
                     onChange={handleChange}/>
                     <Select
                            value={selectedCounty}
                            options={options}
                            onChange={handleCountyChange}
                            placeholder="Select a County"
                     />
                     <label htmlFor="form">Which areas are of interest to you during the summit?</label>
                    <span>{errorMessages.areaOfInterests}</span>
                    <select name="areaOfInterests" id="interests-area" onChange={handleChange}>
                        <option value=""></option>
                        <option value="blue economy">Blue Economy</option>
                        <option value="climate change">Climate Change</option>
                        <option value="digital economy">Digital Economy</option>
                        <option value="circular economy">Circular economy</option>
                        <option value="cybersecurity ">Cybersecurity </option>
                        <option value="all if possible">All if Possible</option>
                    </select>
                    <div className="modal-button">
                            <button type='submit'>Register</button>
                    </div> 
                </form>
                    </div>
                    </div>
                )}
                {/* <Home usersList={usersList} /> */}
        </div>
            )}
        </div>
        
    )
}

export default CyberSec;