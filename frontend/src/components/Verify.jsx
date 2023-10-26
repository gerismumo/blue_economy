import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

function Verify() {
    // Define the registrationPageUrl
    const registrationPageUrl = 'https://rsvp.blueeconomysummit.co.ke/registration'; // Replace with your registration URL

    const [qrCodeScanned, setQRCodeScanned] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    // Listen for the beforeunload event
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (qrCodeScanned) {
                // Redirect to the desired URL when the QR code is scanned
                window.location.href = 'https://rsvp.blueeconomysummit.co.ke/registration'; // Replace with your desired URL
            } else {
                // You can show a warning message to the user if they try to navigate away
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
