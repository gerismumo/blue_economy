import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let fileId = null;
  useEffect(() => {
    const fetchCurrentFile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fileDetails`);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          setCurrentFile(data.data);
          setLoading(false);
        } else {
          toast.error('Error fetching current file');
          setError('Error fetching current file')
        setLoading(false);
        } 
      } catch (error) {
        setError(error.message)
        setLoading(false);
      }
    };

    fetchCurrentFile();
  }, []);
  console.log('currentFile',currentFile)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  if (currentFile && currentFile.length > 0) {
    fileId = currentFile[0].file_id;
    // console.log('File ID:', fileId);
  }
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('formData',formData);
    const upload_api = `${process.env.REACT_APP_API_URL}/api/upload/${fileId}`;
    // console.log('upload_api',upload_api);
    try {
      const response = await fetch(upload_api , {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('File uploaded successfully');
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(`Error uploading file: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
 
  const downloadFile = () => {
    const file = currentFile[0].file;
    const blob = new Blob([file], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile[0].file_name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
         {loading && <p>...loading</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error &&  (
                <div className="upload-container">
                  < div className='header'>
                        <nav>
                            <div className="header-logo">
                                <img src="/images/WhatsApp Image 2023-10-11 at 17.14.19.jpeg" alt="logo" width="200px" 
                                        className="logo-image"
                                    />
                            </div>
                            <div className="links">
                              <button><Link to='/adminPage'>Back</Link></button>
                            </div>
                       </nav>     
                    </div>
                <ToastContainer />
                <div className="file-container">
                  <div className="current-file">
                      <p>Current File: {currentFile.map(file => (file.file_name))}</p>
                      {currentFile.length > 0 && (
                          <button onClick={downloadFile} className="download-button">
                          Download
                          </button>
                      )}
                  </div>
                  <p>Change the file below;</p>
                  <div className="upload-file">
                      <input type="file" id="file-input" onChange={handleFileChange}/>
                      <button onClick={handleUpload} className="upload-button">
                          Upload
                      </button>
                  </div>
              </div>
                </div>
                
            )}
    </div>
    
  );
}

export default UploadFile;
