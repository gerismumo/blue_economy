import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

function Attend() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [qrCodeData, setQRCodeData] = useState('');

    const User_List_Api = `${process.env.REACT_APP_API_URL}/api/usersList`;
        useEffect(() => {
            fetch(User_List_Api)
            .then(response => {
                if(!response.ok) {
                    throw new Error('Failed to fetch persons list');
                }
                return response.json();
            })
            .then(data => {
                setUsersList(data.data)
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            })
        }, [User_List_Api]);

        // console.log(usersList);
        useEffect(() => {
            const userInformation = usersList.map(user => {
              return `${user.user_email}`;
            });
        
            const combinedData = userInformation.join(' '); // Combine data with line breaks
        
            setQRCodeData(combinedData);
            console.log(combinedData);
          }, [usersList]);
          
          const handlePrint = () => {
            // const qrCodeElement = document.getElementById('qr-code');
            window.print();
        };

    return (
        <div>
            {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className='data-page'>
                    <div className="data-page-content">
                        <div className="data-text">
                            <h1>Scan to confirm</h1>
                        </div>
                        <div className="data-code">
                            <QRCode value={qrCodeData} id="qr-code"/>
                        </div>
                        <div className="button-container">
                            <button onClick={handlePrint}>Print</button>
                        </div>
                    </div> 
                </div>
            )}
        </div>
        
    )
}

export default Attend;