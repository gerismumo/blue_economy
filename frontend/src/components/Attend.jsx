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
              return `Name: ${user.user_name}, Email: ${user.user_email}, Phone: ${user.phone_number}`;
            });
        
            const combinedData = userInformation.join('\n'); // Combine data with line breaks
        
            setQRCodeData(combinedData);
          }, [usersList]);

    return (
        <div>
            {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className='data-page'>
               <QRCode value={qrCodeData} />
            </div>
            )}
        </div>
        
    )
}

export default Attend;