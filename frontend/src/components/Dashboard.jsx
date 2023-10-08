import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

function Dashboard() {

    const [importedData, setImportedData] = useState(null);
    const[usersList, setUsersList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setImportedData((prevData) => (prevData ? [...prevData, ...jsonData.slice(1)] : jsonData));
            };
            reader.readAsArrayBuffer(file);
        })
      };
      
      const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx, .xls',
      });
      
      const exportToExcel = () => {
        if (importedData) {
          const worksheet = XLSX.utils.aoa_to_sheet(importedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          XLSX.writeFile(workbook, 'registered_users.xlsx');
        }
      };
      const clearTable = () => {
        setImportedData(null);
      }

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
            setEditingUser(user);
            setIsModalOpen(true);
            
        }
        const hearAboutEventValues = editingUser.hear_about_event.split(',');
    return (
        <div className="dashboard">
            <header>
                <nav>
                    <h1>Dashboard</h1>
                </nav>
            </header>
            <div className="dashboard-tabs">
                <div className="search-tab">
                    <input type="text" 
                        name='search'
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder='search'
                    />
                </div>
                <div className="middle-tabs">
                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()}  type='file' placeholder='Import'/>
                        <label htmlFor="file-input">Import Excel</label>
                    </div>
                    <div className='button-tabs'>
                        <button onClick={exportToExcel}>Export to Excel</button>
                        <button onClick={clearTable}>Clear Table</button>
                    </div>
                    <div className="add-user">
                        <div className="add-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="add-text">
                            <p>add User</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="users-table">
                {importedData === null? (
                    <div className='table-data'>
                        No available Data
                    </div>
                ):(
                <div>
                <table>
                    <thead>
                    <tr>
                        {importedData[0].map((header, index) => (
                            <React.Fragment key={index}>
                            <th>{header}</th>
                            </React.Fragment>
                        ))}
                        <th>Delete</th>
                        <th>Edit</th>
                     </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {importedData[0].map((header, index) => (
                        <td key={index}>{row[index] || ''}</td>
                        ))}
                        <td>
                        <button>Delete</button>
                        </td>
                        <td><button>Edit</button></td>
                    </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                )}
            </div> */}
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
                <form >
                        <label htmlFor="email"  >Email</label>
                        <input 
                        type='email' 
                        placeholder='johndoe@gmail.com' 
                        name='email'
                        value={editingUser.user_email}
                        />
                        <label htmlFor="name">Full name</label>
                        <input type='text'
                        name='name'
                        placeholder='John Doe' 
                        value={editingUser.user_name}
                        />
                        <label htmlFor="occupation">Designation/Occupation/Role</label>
                        <input type="text" 
                        name='occupation'
                        value={editingUser.occupation}
                        />
                        <label htmlFor="company">Company/Organisation</label>
                        <input type='text'
                        name='company'
                        value={editingUser.company}
                        />
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="tel" 
                        name='phoneNumber'
                        value={editingUser.phone_number}
                        />
                        <label htmlFor="form">Which industry are you in?</label>
                        <input type="text" 
                        name='industry'
                        value={editingUser.industry_in}
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
                            />
                            whatsapp
                        </label>
                        </div>
                        
                        <label htmlFor="form">Did you attend last year's Blue Economy Summit?</label>
                        <select name="attendLastYear" id="attend" defaultValue={editingUser.attend_last_year}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">Which areas are of interest to you during the summit?</label>
                        <select name="areaOfInterests" id="interests-area" defaultValue={editingUser.user_interest}>
                            <option value="blue economy">Blue Economy</option>
                            <option value="climate change">Climate Change</option>
                            <option value="digital economy">Digital Economy</option>
                            <option value="all if possible">All if Possible</option>
                        </select>
                        <label htmlFor="form">Do you consent joining our mailing list to receive our newsletter?</label>
                        <select name="joinMailList" id="join-mail" defaultValue={editingUser.join_newsletter}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">How will you be joining this year's summit?</label>
                        <select name="JoinAs" id="join-summit" defaultValue={editingUser.join_as}>
                            <option value="Startup">Start Up</option>
                            <option value="Delegate">Delegate</option>
                            <option value="Government">Government</option>
                            <option value="Exhibitor">Exhibitor</option>
                            <option value="Sponsor/Donor"></option>
                        </select>
                        <label htmlFor="form">Describe your product or the services that you offer?</label>
                        <input type="text"
                        name='describeYourProduct'
                        value={editingUser.describe_product}
                        />
                        <label htmlFor="form">Which category do you fall in?</label>
                        <select name="categoryFall" defaultValue={editingUser.category_fall}>
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