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

    return(
        <div className="confirm-page">
            <h1>Event Check-In</h1>
            {/* <label>Email:
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Phone:
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <button onClick={() => setResult('')}>
                Clear Result
            </button>
            <QrReader
                onScan={handleScan}
                onError={handleError}
                style={{ width: '100%' }}
            />
            <p>{result}</p> */}
             {!scanEnabled ? (
                <div>
                <label>Email:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>Phone:
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <button onClick={handleNext}>Next</button>
                </div>
            ) : (
                <div>
                <QrReader
                    onScan={handleScan}
                    onError={handleError}
                    style={{ width: '100%' }}
                />
                <p>{result}</p>
                </div>
            )}
        </div>
    )
}

export default Confirm;