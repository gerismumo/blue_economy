import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Confirm() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [scanEnabled, setScanEnabled] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    const identifyQRCodeData = (qrCodeData) => {
      // Extract the data from the QR code
      const extractedData = qrCodeData.split(' ');
      console.log(extractedData);
      return extractedData;
    };

    const handleScan = (qrCodeData) => {
      if (qrCodeData ) {
        const data = identifyQRCodeData(qrCodeData);
        if (data.includes(email)) {
          setTimeout(() => {
            setScanEnabled(false); 
            navigate('/confirmMessage')
          }, 2000); 

          setTimeout(() => {
            navigate('/')
          }, 5000); 

        } else {
        setTimeout(() => {
            setScanEnabled(false); 
            setResult('You are not eligible to attend the event.');
            // toast.error('You are not eligible to attend the event.')
          }, 6000);
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
        html5QrCode.clear();
        setHtml5QrCode(null); // Clear the instance
      }
    }

    // Cleanup the QR code scanner when the component unmounts
    return () => {
      if (html5QrCode) {
        html5QrCode.clear();
      }
    };
  }, [scanEnabled, email, phone, html5QrCode]);

  const handleBack = () => {
    setScanEnabled(false);
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
      <ToastContainer />
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
              <div className="confirm-btn">
                <button onClick={() => setScanEnabled(true)}>Next</button>
              </div>
              <p id='message'>{result}</p>
            </div>
          ) : (
            <div>
              <div id="qr-reader" style={{ width: '100%', height: '300px' }}></div>
              {/* <p>{result}</p> */}
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
