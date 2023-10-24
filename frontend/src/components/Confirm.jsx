import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';

function Confirm() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [scanEnabled, setScanEnabled] = useState(false);

  // Define the Html5QrcodeScanner instance in the component's state
  const [html5QrCode, setHtml5QrCode] = useState(null);

  useEffect(() => {
    const identifyQRCodeData = (qrCodeData) => {
      // Extract the data from the QR code
      const extractedData = qrCodeData.split(',');
      return extractedData;
    };

    const handleScan = (qrCodeData) => {
      if (qrCodeData) {
        const data = identifyQRCodeData(qrCodeData);

        if (data[0] === email && data[1] === phone) {
          setResult('You are eligible to attend the event.');
        } else {
          setResult('You are not eligible to attend the event.');
        }
      }
    };

    if (scanEnabled) {
      // Start scanning
      if (!html5QrCode) {
        // Initialize the Html5QrcodeScanner instance
        const newHtml5QrCode = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: 250 }
        );
        setHtml5QrCode(newHtml5QrCode);
        newHtml5QrCode.render(
          (qrCodeData) => {
            handleScan(qrCodeData);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    } else {
      // Stop scanning
      if (html5QrCode) {
        html5QrCode.stop();
        setHtml5QrCode(null); // Clear the instance
      }
    }

    // Cleanup the QR code scanner when the component unmounts
    return () => {
      if (html5QrCode) {
        html5QrCode.stop();
      }
    };
  }, [scanEnabled, email, phone, html5QrCode]);

  const handleBack = () => {
    setScanEnabled(false); // Stop scanning
  };

  return (
    <div className="confirm-page">
      <div className="header">
        <nav>
          <div className="nav-logo">
            <img
              src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg"
              alt="logo"
              className="logo"
            />
          </div>
        </nav>
      </div>
      <div className="confirm-content">
        <div className="confirm-form">
            {!scanEnabled ? (
            <div>
                <label>
                Email:
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </label>
                <label>
                Phone:
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                </label>
                <div className="confirm-btn">
                <button onClick={() => setScanEnabled(true)}>Next</button>
                </div>
            </div>
            ) : (
            <div>
                <div id="qr-reader" style={{ width: '100%', height: '300px' }}></div>
                <p>{result}</p>
                <div className="confirm-btn">
                <button onClick={handleBack}>Back</button>
                </div>
            </div>
            )}
        </div>
      </div>
      
    </div>
  );
}

export default Confirm;
