import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
    const[errorMessages, setErrorMessages] = useState({});
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
    
        setErrorMessages({
            ...errorMessages,
            [name]: '',
        });
    }

    const [checkedBoxes, setCheckedBoxes] = useState([]);

        const handleCheckboxChange = (event) => {
            const { value } = event.target;
            const updatedCheckedBoxes = checkedBoxes.includes(value)
            ? checkedBoxes.filter((item) => item !== value)
            : [...checkedBoxes, value];

            setCheckedBoxes(updatedCheckedBoxes);
        };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = {};

        if(!formData.attendLastYear) {
            errors.areaOfInterests = 'Please select an option';
        }

        if(Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

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
        

        fetch('http://localhost:5000/registerUsers', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(result => {
            console.log('data being submitted', result);
        })
        .catch ((error) => {
            console.log('Error in registerig User', error);
        });  
    }
    return (
        <div className='register'>
            <div className="header">
                <nav>
                    <Link to="/login">
                    <h1> Blue Economy Innovation & Investment Summit 2023</h1>
                    </Link>
                </nav>
            </div>
            <div className="register-form">
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
                            checked={checkedBoxes.includes('SocialMedia')}
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
                            checked={checkedBoxes.includes('LinkedIn')}
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
                            checked={checkedBoxes.includes('word Of Mouth')}
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
                            checked={checkedBoxes.includes('Whatsapp')}
                            onChange={handleCheckboxChange}
                        />
                        whatsapp
                    </label>
                    </div>
                    <span>{errorMessages.areaOfInterests}</span>
                    <label htmlFor="form">Did you attend last year's Blue Economy Summit?</label>
                    <select name="attendLastYear" id="attend" onChange={handleChange}>
                        <option value=""></option>
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
    )
}

export default Register;