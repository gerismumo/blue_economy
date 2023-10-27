import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

function Verify() {
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    // Define the registrationPageUrl
    const registrationPageUrl = 'https://rsvp.blueeconomysummit.co.ke/registration'; // Replace with your registration URL

    const [qrCodeScanned, setQRCodeScanned] = useState(false);

    const handlePrint = () => {
        window.print();
    };

 
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (qrCodeScanned) {
                window.location.href = 'https://rsvp.blueeconomysummit.co.ke/registration'; // Replace with your desired URL
            } else {
                event.returnValue = 'You have not scanned the QR code.';
            }
        };

        window.onbeforeunload = handleBeforeUnload;

        return () => {
            window.onbeforeunload = null; // Remove the event listener when the component unmounts
        };
    }, [qrCodeScanned]);

    const handleQRCodeScan = () => {
        // Set the flag to indicate that the QR code has been scanned
        setQRCodeScanned(true);
    };

    useEffect(() => {
        if(user.organiser_role !== 'admin'){
            navigate('/login');
        }
        if(!user){
            navigate('/');
          }
        }, [user,navigate])

    return (
        <div className='data-page'>
            <div className="data-page-content">
                <div className="data-text">
                    <h1>Scan to confirm</h1>
                </div>
                <div className="data-code">
                    <a href={registrationPageUrl} target="_blank" rel="noopener noreferrer">
                        <QRCode value={registrationPageUrl} onScan={handleQRCodeScan} />
                    </a>
                </div>
                <div className="button-container">
                    <button onClick={handlePrint}>Print</button>
                </div>
            </div>
        </div>
    )
}

export default Verify;
