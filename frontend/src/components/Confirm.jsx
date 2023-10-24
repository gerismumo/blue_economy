import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
function Confirm() {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState('');
    const [scanEnabled, setScanEnabled] = useState(false);

    // Function to handle the QR code scan
    const handleScan = (data) => {
        if (data === `${email}${phone}`) {
        setResult('You are eligible to attend the event.');
        } else {
        setResult('You are not eligible to attend the event.');
        }
    };

    // Function to handle scan error
    const handleError = (error) => {
        console.error(error);
        setResult('Error scanning the QR code.');
    };

    const handleNext = () => {
        if (email && phone) {
          setScanEnabled(true);
        }
      }

      const handleBack = () => {
        setScanEnabled(false);
      }
    return(
        <div className="confirm-page">
            < div className='header'>
                <nav>
                    <div className="nav-logo">
                        <img src='/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg' alt='logo'
                        className='logo'/>
                    </div>
                </nav>
            </div>
        <div className="confirm-content">
            <h1>Event Check-In</h1>
            <div className="confirm-form">
            {!scanEnabled ? (
                    <div>
                    <label>Email:
                        <input 
                        type="text" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        />
                    </label>
                    <label>Phone:
                        <input type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required
                        />
                    </label>
                    <div className="confirm-btn">
                        <button onClick={handleNext}>Next</button>
                    </div>
                    </div>
                ) : (
                    <div>
                    <QrReader
                        onScan={handleScan}
                        onError={handleError}
                        style={{ width: '100%' }}
                    />
                    <p>{result}</p>
                    <div className="confirm-btn">
                        <button onClick={handleBack}>Back</button>
                    </div>
                    
                    </div>
                    
                )}
            </div> 
            </div>
        </div>
    )
}

export default Confirm;