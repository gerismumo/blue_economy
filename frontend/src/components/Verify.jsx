import React from 'react';
import QRCode from 'react-qr-code';
function Verify() {

    const path = '/registration';
    return (
        <div className='verify-page'>
            <QRCode value={path} />
        </div>
    )
}

export default Verify;