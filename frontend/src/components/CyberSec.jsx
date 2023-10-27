import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    

      //handle search 
      const[searchQuery, setSearchQuery] = useState('');
      const handleSearch = (event) => {
        setSearchQuery(event.target.value);
      }

      const filteredData = usersList
        ? usersList.filter((user) => {
          
            return (
                (user.attendee_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
                user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.portifolio_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.submitted_project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.project_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.project_count.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.college_uni.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.job_speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // user.registered_at.toString().toLowerCase().includes(searchQuery.toLowerCase())  ||  
                user.team_mates.toLowerCase().includes(searchQuery.toLowerCase())  ||
                user.heard_where.toLowerCase().includes(searchQuery.toLowerCase())  ||
                user.county.toLowerCase().includes(searchQuery.toLowerCase())  ||
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
            }  
        }

        const hearAboutEventValues = editingUser ? editingUser.hear_about_event.split(',') : [];
        const handleChanges = (event) => {
            const { name, value } = event.target;
            setEditingUser((prevEditingUser) => ({
              ...prevEditingUser,
              [name]: value,
            }));
          }
          const handleCheckboxChange = (event) => {
            const checkboxValue = event.target.value;
            const isChecked = event.target.checked;
          
            setEditingUser((prevEditingUser) => {
              let updatedHearAboutEvent = [...hearAboutEventValues];
          
              if (isChecked) {
                updatedHearAboutEvent.push(checkboxValue);
              } else {
                updatedHearAboutEvent = updatedHearAboutEvent.filter(
                  (value) => value !== checkboxValue
                );
              }
          
              return {
                ...prevEditingUser,
                hear_about_event: updatedHearAboutEvent.join(','),
              };
            });
          };

          //submit edit data
          const handleSubmitEditData = async(e) => {
            e.preventDefault();
                try {
                    if(!editingUser || !editingUser.user_id) {
                        console.log('Invalid editing user data or user_id');
                        return;
                    }
                    const API_URL = `${process.env.REACT_APP_API_URL}/api/editUser/${editingUser.user_id}`
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
                                if (user.user_id === editingUser.user_id) {
                                    return {
                                        ...user,
                                        user_email: editingUser.user_email,
                                        user_name: editingUser.user_name,
                                        occupation: editingUser.occupation,
                                        company: editingUser.company,
                                        phone_number: editingUser.phone_number,
                                        industry_in: editingUser.industry_in,
                                        hear_about_event: editingUser.hear_about_event,
                                        attend_last_year: editingUser.attend_last_year,
                                        user_interest: editingUser.user_interest,
                                        join_newsletter: editingUser.join_newsletter,
                                        join_as: editingUser.join_as,
                                        describe_product: editingUser.describe_product,
                                        category_fall: editingUser.category_fall
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
            firstname: '',
            lastname: '',
            fullname: '',
            email: '',
            portfolioUrl: '',
            submitProject: '',
            projectUrl:'',
            city:'',
            state:'',
            country:'',
            projectCount:'',
            collegeUni:'',
            jobSpecialty:'',
            teamMates:'',
            heardHack:'',
            county:'',
            phoneNumber:'',
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
                    firstname: '',
                    lastname: '',
                    fullname: '',
                    email: '',
                    portfolioUrl: '',
                    projectUrl:'',
                    city:'',
                    state:'',
                    country:'',
                    projectCount:'',
                    collegeUni:'',
                    jobSpecialty:'',
                    county:'',
                    phoneNumber:'',
                }); 
            }

            const handleSubmit = async(e) => {
                e.preventDefault();
               
                const errors = {};
                if(!formData.firstname) {
                    errors.firstname = 'Please enter first Name'
                }
                if(!formData.lastname) {
                    errors.lastname = 'Please enter lastname'
                }
                if(!formData.fullname) {
                    errors.fullname = 'Please enter your Full Name'
                }
                if(!formData.email) {
                    errors.email = 'Please enter a valid email'
                }
                if(!formData.submitProject) {
                    errors.submitProject = 'Please select an option'
                }
                if(!formData.city) {
                    errors.city = 'Please enter City name'
                }
                if(!formData.state) {
                    errors.state = 'Please enter State name';
                }
                if(!formData.country) {
                    errors.country = 'Please enter country name';
                }
                if(!formData.county) {
                    errors.county = 'Please enter county name';
                }
                if(!formData.JoinAs) {
                    errors.JoinAs = 'Please select an option';
                }
                if(!formData.phoneNumber) {
                    errors.phoneNumber = 'Please enter a phone number';
                }
                
                const requestData = {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    fullname: formData.fullname,
                    email: formData.email,
                    portfolioUrl: formData.portfolioUrl,
                    submitProject: formData.submitProject,
                    projectUrl: formData.projectUrl,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    projectCount: formData.projectCount,
                    collegeUni: formData.collegeUni,
                    jobSpecialty: formData.jobSpecialty,
                    teamMates: formData.teamMates,
                    heardHack: formData.heardHack,
                    county: formData.county,
                    phoneNumber: formData.phoneNumber,
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
                            first_name: requestData.firstname,
                            last_name: requestData.lastname,
                            full_name: requestData.fullname,
                            email:requestData.email,
                            portifolio_url:requestData.portfolioUrl,
                            submitted_project: requestData.submitProject,
                            project_url: requestData.projectUrl,
                            city: requestData.city,
                            state: requestData.state,
                            country: requestData.country,
                            project_countt: requestData.projectCount,
                            college_uni: requestData.collegeUni,
                            job_speciality: requestData.jobSpecialty,
                            team_mates: requestData.teamMates,
                            heard_where: requestData.heardHack,
                            county: requestData.county,
                            phone_number: requestData.phoneNumber,
                        }
                        setUsersList(prevList => [...prevList, newAttendee]);
                    } else {
                        toast.error('Email already exists'); 
                        setTimeout(() => {
                            setAddFormOpen(false);
                        }, 1000);
                    }
                    resetFormFields();
                    document.getElementById('submit-project').selectedIndex = 0;
                    document.getElementById('team-select').selectedIndex = 0;
                    document.getElementById('heard-select').selectedIndex = 0;    
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

    const exportToExcel = () => {
        const dataToExport = filteredData.map((user) => ({
          'First Name': user.first_name,
          'Last Name': user.last_name,
          'Full Name': user.full_name,
          'Email': user.email,
          'Portfolio Url': user.portifolio_url,
          'Submitted Project?': user.submitted_project,
          'Project URLs': user.project_url,
          'City': user.city,
          'State': user.state,
          'Country': user.country,
          'Project Count':user.project_count ,
          'College/University Name': user.college_uni,
          'Job Specialty': user.job_speciality,
        //   'Registered At': user.registered_at,
          'Do you have teammates?': user.team_mates,
          'Who told you about this hackathon?': user.heard_where,
          'County of Residence': user.county,
          'Phone number( For communication purposes only)': user.phone_number,
          'Attended': attendedStatuses[user.attendee_id] ? 'Yes' : 'No',
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
                            <option value="/dashboard">dashboard</option>
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
                            <th>Attendee ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Portfolio Url</th>
                            <th>Submitted Project?</th>
                            <th>Project URLs</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Project Count</th>
                            <th>College/University Name</th>
                            <th>Job Specialty</th>
                            {/* <th>Registered At</th> */}
                            <th>Do you have teammates?</th>
                            <th>Who told you about this hackathon?</th>
                            <th>County of Residence</th>
                            <th>Phone number( For communication purposes only)</th>
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
                                <td>{user.attendee_id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.portifolio_url}</td>
                                <td>{user.submitted_project}</td>
                                <td>{user.project_url}</td>
                                <td>{user.city}</td>
                                <td>{user.state}</td>
                                <td>{user.country}</td>
                                <td>{user.project_count}</td>
                                <td>{user.college_uni}</td>
                                <td>{user.job_speciality}</td>
                                {/* <td>{user.registered_at}</td> */}
                                <td>{user.team_mates}</td>
                                <td>{user.heard_where}</td>
                                <td>{user.county}</td>
                                <td>{user.phone_number}</td>
                                {/* <td><button onClick={()=>handleEditUser(user)}>Edit</button></td> */}
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
                        value={editingUser.user_email}
                        onChange={handleChanges}
                        />
                        <label htmlFor="name">Full name</label>
                        <input type='text'
                        name='user_name'
                        placeholder='John Doe' 
                        value={editingUser.user_name}
                        onChange={handleChanges}
                        />
                        <label htmlFor="occupation">Designation/Occupation/Role</label>
                        <input type="text" 
                        name='occupation'
                        value={editingUser.occupation}
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
                        <label htmlFor="form">Which industry are you in?</label>
                        <input type="text" 
                        name='industry_in'
                        value={editingUser.industry_in}
                        onChange={handleChanges}
                        />
                        <label htmlFor="form">How did you hear about the event?</label>
                        <div className="select-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="hearChecks"
                                className='event-CheckBox'
                                value="Email"
                                checked={hearAboutEventValues.includes('Email')}
                                onChange={handleCheckboxChange}
                            />
                            Email
                        </label>
                        </div>
                        <div className="select-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="hearChecks"
                                className='event-CheckBox'
                                value="SocialMedia"
                                checked={hearAboutEventValues.includes('SocialMedia')}
                                onChange={handleCheckboxChange}
                            />
                            Social Media
                        </label>
                        </div>
                        {/* <div className="select-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="hearChecks"
                                className='event-CheckBox'
                                value="LinkedIn"
                                checked={hearAboutEventValues.includes('LinkedIn')}
                                onChange={handleCheckboxChange}
                            />
                            LinkedIn
                        </label>
                        </div> */}
                        <div className="select-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="hearChecks"
                                className='event-CheckBox'
                                value="word Of Mouth"
                                checked={hearAboutEventValues.includes('word Of Mouth')}
                                onChange={handleCheckboxChange}
                            />
                            Word of Mouth
                        </label>
                        </div>
                        {/* <div className="select-checkboxes">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="hearChecks"
                                className='event-CheckBox'
                                value="Whatsapp"
                                checked={hearAboutEventValues.includes('Whatsapp')}
                                onChange={handleCheckboxChange}
                            />
                            whatsapp
                        </label>
                        </div> */}
                        
                        <label htmlFor="form">Did you attend last year's Blue Economy Summit?</label>
                        <select name="attend_last_year" id="attend" value={editingUser.attend_last_year} onChange={handleChanges}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">Which areas are of interest to you during the summit?</label>
                        <select name="user_interest" id="interests-area" value={editingUser.user_interest} onChange={handleChanges}>
                            <option value="blue economy">Blue Economy</option>
                            <option value="climate change">Climate Change</option>
                            <option value="digital economy">Digital Economy</option>
                            <option value="circular economy">Circular economy</option>
                            <option value="cybersecurity ">Cybersecurity </option>
                            <option value="all if possible">All if Possible</option>
                        </select>
                        <label htmlFor="form">Do you consent joining our mailing list to receive our newsletter?</label>
                        <select name="join_newsletter" id="join-mail" value={editingUser.join_newsletter} onChange={handleChanges}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">How will you be joining this year's summit?</label>
                        <select name="join_as" id="join-summit" value={editingUser.join_as} onChange={handleChanges}>
                            <option value="Startup">Start Up</option>
                            <option value="Delegate">Delegate</option>
                            <option value="Government">Government</option>
                            <option value="Exhibitor">Exhibitor</option>
                            <option value="Sponsor/Donor"></option>
                        </select>
                        <label htmlFor="form">Describe your product or the services that you offer?</label>
                        {/* <input type="text"
                        name='describe_product'
                        value={editingUser.describe_product}
                        onChange={handleChanges}
                        /> */}
                        <textarea
                            name='describe_product'
                            value={editingUser.describe_product}
                            onChange={handleChanges}
                            rows={5} // Adjust the number of rows as needed
                            cols={40} // Adjust the number of columns as needed
                            ></textarea>
                        <label htmlFor="form">Which category do you fall in?</label>
                        <select name="category_fall" value={editingUser.category_fall} onChange={handleChanges}>
                            <option value="StartUp(KES 5000)">StartUp(KES 5000)</option>
                            <option value="Corporate Institution (KES 30,000)">Corporate Institution (KES 30,000)</option>
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
                        {/* Place your form code here */}
                        <form onSubmit={handleSubmit}>
                    <label htmlFor="firstname">First name</label>
                    <span>{errorMessages.firstname}</span>
                    <input type='text'
                    name='firstname'
                     value={formData.firstname}
                     placeholder='John' 
                     onChange={handleChange}/>
                     <label htmlFor="lastname">Last name</label>
                    <span>{errorMessages.lastname}</span>
                    <input type='text'
                    name='lastname'
                     value={formData.lastname}
                     placeholder='Doe' 
                     onChange={handleChange}/>
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
                    <label htmlFor="portfoliourl">Portfolio Url</label>
                    <span></span>
                    <input type='url'
                    name='portfolioUrl'
                     value={formData.portfolioUrl}
                     onChange={handleChange}/>
                     <label htmlFor="form">Submitted Project?</label>
                    <span>{errorMessages.submitProject}</span>
                     <select name="submitProject" id="submit-project" onChange={handleChange}>
                        <option value=""></option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label htmlFor="projecturls">Project URLs</label>
                    <span></span>
                    <input type='url'
                    name='projectUrl'
                     value={formData.projectUrl}
                     onChange={handleChange}/>
                     <label htmlFor="projecturls">City</label>
                    <span>{errorMessages.city}</span>
                    <input type='text'
                    name='city'
                     value={formData.city}
                     onChange={handleChange}/>
                     <label htmlFor="state">State</label>
                    <span>{errorMessages.state}</span>
                    <input type='text'
                    name='state'
                     value={formData.state}
                     onChange={handleChange}/>
                     <label htmlFor="country">Country</label>
                    <span>{errorMessages.country}</span>
                    <input type='text'
                    name='country'
                     value={formData.country}
                     onChange={handleChange}/>
                     <label htmlFor="projectcount">Project Count</label>
                    <span></span>
                    <input type='number'
                    name='projectCount'
                     value={formData.projectCount}
                     onChange={handleChange}
                     min='0'/>
                     <label htmlFor="projecturls">College/University Name</label>
                    <span></span>
                    <input type='text'
                    name='collegeUni'
                     value={formData.collegeUni}
                     onChange={handleChange}/>
                     <label htmlFor="projecturls">Job Specialty</label>
                    <span></span>
                    <input type='text'
                    name='jobSpecialty'
                     value={formData.jobSpecialty}
                     onChange={handleChange}/>
                     <label htmlFor="form">Do you have teammates?</label>
                    <span></span>
                     <select name="teamMates" id="team-select" onChange={handleChange}>
                        <option value=""></option>
                        <option value="Already have a team">Already have a team</option>
                        <option value="Looking for teammates">Looking for teammates</option>
                        <option value="Working solo">Working solo</option>
                    </select>
                    <label htmlFor="form">Who told you about this hackathon?</label>
                    <span></span>
                     <select name="heardHack" id="heard-select" onChange={handleChange}>
                        <option value=""></option>
                        <option value="Devpost">Devpost</option>
                        <option value="The organizer">The organizer</option>
                        <option value="Friend">Friend</option>
                        <option value="My college">My college</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                    </select>
                    <label htmlFor="projecturls">County of Residence</label>
                    <span>{errorMessages.county}</span>
                    <input type='text'
                    name='county'
                     value={formData.county}
                     onChange={handleChange}/>
                     <label htmlFor="projecturls">Phone number( For communication purposes only)</label>
                    <span>{errorMessages.phoneNumber}</span>
                    <input type='text'
                    name='phoneNumber'
                     value={formData.phoneNumber}
                     onChange={handleChange}/>
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