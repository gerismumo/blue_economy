import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Dashboard() {

    // const [importedData, setImportedData] = useState(null);
    const[usersList, setUsersList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // const onDrop = (acceptedFiles) => {
    //     acceptedFiles.forEach((file) => {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //         const data = new Uint8Array(e.target.result);
    //         const workbook = XLSX.read(data, { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //         setImportedData((prevData) => (prevData ? [...prevData, ...jsonData.slice(1)] : jsonData));
    //         };
    //         reader.readAsArrayBuffer(file);
    //     })
    //   };
      
    //   const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     accept: '.xlsx, .xls',
    //   });
      
    //   const exportToExcel = () => {
    //     if (importedData) {
    //       const worksheet = XLSX.utils.aoa_to_sheet(importedData);
    //       const workbook = XLSX.utils.book_new();
    //       XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //       XLSX.writeFile(workbook, 'registered_users.xlsx');
    //     }
    //   };
    //   const clearTable = () => {
    //     setImportedData(null);
    //   }

      //handle search 
      const[searchQuery, setSearchQuery] = useState('');
      const handleSearch = (event) => {
        setSearchQuery(event.target.value);
      }

      const filteredData = usersList
        ? usersList.filter((user) => {
            return (
                user.user_id.toString().toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
                user.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.industry_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.hear_about_event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.attend_last_year.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.user_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.join_newsletter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.join_as.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.describe_product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.category_fall.toLowerCase().includes(searchQuery.toLowerCase())    
            );
            })
        : []
        //get users list 

        
        useEffect(() => {
            fetch('http://localhost:5000/usersList')
            .then(response => response.json())
            .then(data => setUsersList(data.data))
        }, []);

        //handle delete user

        const handleDeleteUser = async(user_id) => {
            try {
                const response = await fetch(`http://localhost:5000/deleteUser/${user_id}`, {
                method: 'DELETE',  
                })
                if(response.ok) {
                    const updatedUsersList = usersList.filter((user) => user_id !== user.user_id);
                    setUsersList(updatedUsersList);
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.log(error);
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
                    
                    const response = await fetch(`http://localhost:5000/editUser/${editingUser.user_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editingUser),
                    });
                    if(response.ok) {
                        setIsModalOpen(false);
                    } else {
                        console.log('failed to edit user');
                    }        
                } catch (error) {
                    console.log(error);
                }
            
          }

          const[isAddFormOpen, setAddFormOpen] = useState(false);
          //add new user
          const handleAddNewUser = () => {
            setAddFormOpen(true);
          }

          const[formData, setFormData] = useState({
            email: '',
            name: '',
            occupation: '',
            company: '',
            phoneNumber: '',
            industry: '',
            attendLastYear:'',
            areaOfInterests:'',
            joinMailList:'',
            JoinAs:'',
            describeYourProduct:'',
            categoryFall:''
        })
    
        
        
        const handleChange = (e) => {
            const {name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value,
    
            })
        
        }
    
        const [checkedBoxes, setCheckedBoxes] = useState([]);
    
            const handleCheckboxChangeClick = (event) => {
                const { value } = event.target;
                const updatedCheckedBoxes = checkedBoxes.includes(value)
                ? checkedBoxes.filter((item) => item !== value)
                : [...checkedBoxes, value];
    
                setCheckedBoxes(updatedCheckedBoxes);
            };

            const handleSubmit = async(e) => {
                e.preventDefault();
               
                const requestData = {
                    email: formData.email,
                    name: formData.name,
                    occupation: formData.occupation,
                    company: formData.company,
                    phoneNumber: formData.phoneNumber,
                    industry: formData.industry,
                    attendLastYear: formData.attendLastYear,
                    areaOfInterests: formData.areaOfInterests,
                    joinMailList: formData.joinMailList,
                    JoinAs: formData.JoinAs,
                    describeYourProduct: formData.describeYourProduct,
                    categoryFall: formData.categoryFall,
                    selectedCheckBoxes: checkedBoxes.join(','),
                  };
                  
                  
                  try {
                    const response = await fetch('http://localhost:5000/registerUsers', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(requestData),
                    });
                
                    if (!response.ok) {
                      throw new Error('Failed to register user');
                    }
                
                    const result = await response.json();
                    console.log('data being submitted', result);
                    // setUsersList((prevUsersList) => [...prevUsersList, result.data]);
                    setAddFormOpen(false);
                  } catch (error) {
                    console.error('Error in registering User', error);
                  }
            }
    //export to excel

    const exportToExcel = () => {
        const dataToExport = filteredData.map((user) => ({
          'User ID': user.user_id,
          'User Email': user.user_email,
          'User Names': user.user_name,
          'Designation/Occupation/Role': user.occupation,
          'Company/Organization Name': user.company,
          'Phone number(For communication purposes only)': user.phone_number,
          'Which industry are you in?': user.industry_in,
          'How did you hear about the event?': user.hear_about_event,
          'Did you attend last year\'s Blue Economy Summit?': user.attend_last_year,
          'Which areas are of interest to you during the summit?': user.user_interest,
          'Do you consent joining our mailing list to receive our newsletter?': user.join_newsletter,
          'How will you be joining this year\'s summit?': user.join_as,
          'Describe your product or the services that you offer?': user.describe_product,
          'Which category do you fall in?': user.category_fall,
        }));
      
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');
        XLSX.writeFile(workbook, 'users_data.xlsx');
      };
      
        
    return (
        <div className="dashboard">
            < div className='header'>
                <nav>
                    <div className="nav-logo">
                        <img src='/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg'
                        className='logo'/>
                    </div>
                    <div className="nav-home">
                        <Link to='/'>Home</Link>
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
                        <p>{usersList.length}</p>
                        <p>registered Persons</p>
                    </div>
                </div>
                <div className="middle-tabs">
                    {/* <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()}  type='file' placeholder='Import'/>
                        <label htmlFor="file-input">Import Excel</label>
                    </div> */}
                    <div className='button-tabs'>
                        <button onClick={exportToExcel}>Export to Excel</button>
                        {/* <button>Clear Table</button> */}
                    </div>
                    <div className="add-user" onClick={handleAddNewUser}>
                        <div className="add-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="add-text">
                            <p>add User</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Designation/Occupation/Role</th>
                            <th>Company/ Organization Name</th>
                            <th>Phone number(For communication purposes only)</th>
                            <th>Which industry are you in?</th>
                            <th>How did you hear about the event?</th>
                            <th>Did you attend last year's Blue Economy Summit?</th>
                            <th>Which areas are of interest to you during the summit?</th>
                            <th>Do you consent joining our mailing list to receive our newsletter?</th>
                            <th>How will you be joining this year's summit?</th>
                            <th>Describe your product or the services that you offer?</th>
                            <th>Which category do you fall in?</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredData.length === 0 ? (
                        <p>no available data</p>
                    ): (
                        filteredData.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.user_email}</td>
                                <td>{user.user_name}</td>
                                <td>{user.occupation}</td>
                                <td>{user.company}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.industry_in}</td>
                                <td>{user.hear_about_event}</td>
                                <td>{user.attend_last_year}</td>
                                <td>{user.user_interest}</td>
                                <td>{user.join_newsletter}</td>
                                <td>{user.join_as}</td>
                                <td>{user.describe_product}</td>
                                <td>{user.category_fall}</td>
                                <td><button onClick={()=>handleDeleteUser(user.user_id)}>Delete</button></td>
                                <td><button onClick={()=>handleEditUser(user)}>Edit</button></td>
                            </tr>
                        ))
                    )}
                </tbody>
                </table> 
            </div>

            {isModalOpen && editingUser && (
            <div className="modal" style={{ display: isModalOpen ? 'flex' : 'none' }}>
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
                        <div className="select-checkboxes">
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
                        </div>
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
                            Word of Month
                        </label>
                        </div>
                        <div className="select-checkboxes">
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
                        </div>
                        
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
                        <input type="text"
                        name='describe_product'
                        value={editingUser.describe_product}
                        onChange={handleChanges}
                        />
                        <label htmlFor="form">Which category do you fall in?</label>
                        <select name="category_fall" value={editingUser.category_fall} onChange={handleChanges}>
                            <option value="StartUp(KES 5000)">StartUp(KES 5000)</option>
                            <option value="Corporate Institution (KES 30,000)">Corporate Institution (KES 30,000)</option>
                        </select>
                        <button type='submit'>Submit</button>
                </form>
            </div>
            </div>
        )}

        {isAddFormOpen  && (
                    <div className="modal" style={{ display: isAddFormOpen ? 'flex' : 'none' }}>
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setAddFormOpen(false)}>
                        Close
                        </button>
                        {/* Place your form code here */}
                        <form onSubmit={handleSubmit}>
                    <label htmlFor="email"  >Email</label>
                    <input 
                    type='email' 
                    placeholder='johndoe@gmail.com' 
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    />
                    <label htmlFor="name">Full name</label>
                    <input type='text'
                    name='name'
                     value={formData.name}
                     placeholder='John Doe' 
                     onChange={handleChange}/>
                    <label htmlFor="occupation">Designation/Occupation/Role</label>
                    <input type="text" 
                    name='occupation'
                    value={formData.occupation}
                    onChange={handleChange}
                    />
                    <label htmlFor="company">Company/Organisation</label>
                    <input type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    />
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" 
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleChange} 
                    />
                    <label htmlFor="form">Which industry are you in?</label>
                    <input type="text" 
                    name='industry'
                    value={formData.industry}
                    onChange={handleChange}
                    />
                    <label htmlFor="form">How did you hear about the event?</label>
                    <div className="select-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hearChecks"
                            className='event-CheckBox'
                            value="Email"
                            checked={checkedBoxes.includes('Email')}
                            onChange={handleCheckboxChangeClick}
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
                            checked={checkedBoxes.includes('SocialMedia')}
                            onChange={handleCheckboxChangeClick}
                        />
                        Social Media
                    </label>
                    </div>
                    <div className="select-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hearChecks"
                            className='event-CheckBox'
                            value="LinkedIn"
                            checked={checkedBoxes.includes('LinkedIn')}
                            onChange={handleCheckboxChangeClick}
                        />
                        LinkedIn
                    </label>
                    </div>
                    <div className="select-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hearChecks"
                            className='event-CheckBox'
                            value="word Of Mouth"
                            checked={checkedBoxes.includes('word Of Mouth')}
                            onChange={handleCheckboxChangeClick}
                        />
                        Word of Month
                    </label>
                    </div>
                    <div className="select-checkboxes">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="hearChecks"
                            className='event-CheckBox'
                            value="Whatsapp"
                            checked={checkedBoxes.includes('Whatsapp')}
                            onChange={handleCheckboxChangeClick}
                        />
                        whatsapp
                    </label>
                    </div>
                    
                    <label htmlFor="form">Did you attend last year's Blue Economy Summit?</label>
                    <select name="attendLastYear" id="attend" onChange={handleChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label htmlFor="form">Which areas are of interest to you during the summit?</label>
                    <select name="areaOfInterests" id="interests-area" onChange={handleChange}>
                        <option value="blue economy">Blue Economy</option>
                        <option value="climate change">Climate Change</option>
                        <option value="digital economy">Digital Economy</option>
                        <option value="all if possible">All if Possible</option>
                    </select>
                    <label htmlFor="form">Do you consent joining our mailing list to receive our newsletter?</label>
                    <select name="joinMailList" id="join-mail" onChange={handleChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label htmlFor="form">How will you be joining this year's summit?</label>
                    <select name="JoinAs" id="join-summit" onChange={handleChange}>
                        <option value="Startup">Start Up</option>
                        <option value="Delegate">Delegate</option>
                        <option value="Government">Government</option>
                        <option value="Exhibitor">Exhibitor</option>
                        <option value="Sponsor/Donor"></option>
                    </select>
                    <label htmlFor="form">Describe your product or the services that you offer?</label>
                    <input type="text"
                    name='describeYourProduct'
                    value={formData.describeYourProduct}
                    onChange={handleChange}
                     />
                    <label htmlFor="form">Which category do you fall in?</label>
                    <select name="categoryFall" onChange={handleChange}>
                        <option value="StartUp(KES 5000)">StartUp(KES 5000)</option>
                        <option value="Corporate Institution (KES 30,000)">Corporate Institution (KES 30,000)</option>
                    </select>
                    <button type='submit'>Submit</button>
                </form>
                    </div>
                    </div>
                )}
        </div>
    )
}

export default Dashboard;