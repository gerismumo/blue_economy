import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {

    const navigate = useNavigate();
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
    });

    
    
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
            setCheckedBoxes((prevCheckedBoxes) => {
            if (prevCheckedBoxes.includes(value)) {
                return prevCheckedBoxes.filter((item) => item !== value);
            } else {
                return [...prevCheckedBoxes, value];
            }
            });
        };

        const resetFormFields = () => {
            setFormData({
                email: '',
                name: '',
                occupation: '',
                company: '',
                phoneNumber: '',
                industry: '',
                describeYourProduct: '',
            }); 
        }
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = {};
        if(!formData.email) {
            errors.email = 'Please enter a valid email'
        }
        if(!formData.name) {
            errors.name = 'Please enter a valid name'
        }
        if(!formData.occupation) {
            errors.occupation = 'Please enter your occupation'
        }
        if(!formData.company) {
            errors.company = 'Please enter company name'
        }
        if(!formData.phoneNumber) {
            errors.phoneNumber = 'Please enter phone number'
        }
        if(!formData.industry) {
            errors.industry = 'Please enter Industry name'
        }
        if(!formData.attendLastYear) {
            errors.attendLastYear = 'Please select an option';
        }
        if(!formData.areaOfInterests) {
            errors.areaOfInterests = 'Please select an option';
        }
        if(!formData.joinMailList) {
            errors.joinMailList = 'Please select an option';
        }
        if(!formData.JoinAs) {
            errors.JoinAs = 'Please select an option';
        }
        if(!formData.describeYourProduct) {
            errors.describeYourProduct = 'Please enter a description';
        }
        if(!formData.categoryFall) {
            errors.categoryFall = 'Please select a option';
        }

        if(checkedBoxes.length === 0) {
            errors.checkBoxError = "Please select at least one option."
        }
        if(Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            toast.error('Fill all fields with errors')
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
        
          
          const register_user_api = `${process.env.REACT_APP_API_URL}/api/registerUsers`;

        fetch(register_user_api, {
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
                setTimeout(() => {
                    navigate('/feedback');
                }, 2000);
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            } else {
                toast.error('Email already exists'); 
                setTimeout(() => {
                    toast.success('Try another email address')
                }, 3000);
            }
            
            setCheckedBoxes([]);
            resetFormFields();
            document.getElementById('attend').selectedIndex = 0;
            document.getElementById('interests-area').selectedIndex = 0;
            document.getElementById('join-mail').selectedIndex = 0;
            document.getElementById('join-summit').selectedIndex = 0;
            document.getElementById('category-Fall').selectedIndex = 0;
            // navigate('/feedback');
        })
        
        .catch ((error) => {
            throw(error);
        });  
    }

    return (
        <div className='register'>
            <div className="header">
                {/* <nav>
                    <div className="nav-logo">
                        <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" 
                            className="logo-image"
                        />
                    </div>
                    <Link to="/login">
                    <h1> Blue Economy Innovation & Investment Summit 2023</h1>
                    </Link>
                </nav> */}
            </div>
            <div className="register-form">
            <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h1>Blue Economy Innovation & Investment Summit 2023</h1>
                    </div>
                    <div className="form-elements">
                        <label htmlFor="email"  >Email <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.email}</span>
                        <input 
                        type='email' 
                        placeholder='johndoe@gmail.com' 
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        />
                        <label htmlFor="name">Full name <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.name}</span>
                        <input type='text'
                        name='name'
                        value={formData.name}
                        placeholder='John Doe' 
                        onChange={handleChange}
                        />
                        <label htmlFor="occupation">Designation/Occupation/Role <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.occupation}</span>
                        <input type="text" 
                        name='occupation'
                        value={formData.occupation}
                        onChange={handleChange}
                        />
                        
                        <label htmlFor="company">Company/Organisation <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.company}</span>
                        <input type='text'
                        name='company'
                        value={formData.company}
                        onChange={handleChange}
                        />
                    
                        <label htmlFor="phoneNumber">Phone Number <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.phoneNumber}</span>
                        <input type="tel" 
                        name='phoneNumber'
                        value={formData.phoneNumber}
                        onChange={handleChange} 
                        />
                        
                        <label htmlFor="form">Which industry are you in? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.industry}</span>
                        <input type="text" 
                        name='industry'
                        value={formData.industry}
                        onChange={handleChange}
                        />
                        <label htmlFor="form">How did you hear about the event? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.checkBoxError}</span>
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
                        {/* <div className="select-checkboxes">
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
                        </div> */}
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
                                checked={checkedBoxes.includes('Whatsapp')}
                                onChange={handleCheckboxChange}
                            />
                            whatsapp
                        </label>
                        </div> */}
                        
                        <label htmlFor="form">Did you attend last year's Blue Economy Summit? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.attendLastYear}</span>
                        <select name="attendLastYear" id="attend" onChange={handleChange}>
                            <option value=""></option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">Which areas are of interest to you during the summit? <span className="required-asterisk">*</span></label>
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
                        <label htmlFor="form">Do you consent joining our mailing list to receive our newsletter? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.joinMailList}</span>
                        <select name="joinMailList" id="join-mail" onChange={handleChange}>
                            <option value=""></option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label htmlFor="form">How will you be joining this year's summit? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.JoinAs}</span>
                        <select name="JoinAs" id="join-summit" onChange={handleChange}>
                            <option value=""></option>
                            <option value="Startup">Start Up</option>
                            <option value="Delegate">Delegate</option>
                            <option value="Government">Government</option>
                            <option value="Exhibitor">Exhibitor</option>
                            <option value="Sponsor/Donor">Sponsor/Donor</option>
                        </select>
                        <label htmlFor="form">Describe your product or the services that you offer? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.describeYourProduct}</span>
                        <textarea
                            name='describeYourProduct'
                            value={formData.describeYourProduct}
                            onChange={handleChange}
                            rows={5} // Adjust the number of rows as needed
                            cols={40} // Adjust the number of columns as needed
                            ></textarea>
                        <label htmlFor="form">Which category do you fall in? <span className="required-asterisk">*</span></label>
                        <span>{errorMessages.categoryFall}</span>
                        <select name="categoryFall" id='category-Fall' onChange={handleChange}>
                            <option value=""></option>
                            <option value="StartUp(KES 5000)">StartUp(KES 5000)</option>
                            <option value="Corporate Institution (KES 30,000)">Corporate Institution (KES 30,000)</option>
                        </select>
                        <div className="register-button">
                            <button type='submit'>Register</button>
                        </div>
                    </div>
                    
                    
                </form>
            </div>
        </div>
    )
}

export default Register;