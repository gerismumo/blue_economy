import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

function Dashboard() {

    const [importedData, setImportedData] = useState(null);

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            setImportedData((prevData) => (prevData ? [...prevData, ...jsonData.slice(1)] : jsonData));
            };
            reader.readAsArrayBuffer(file);
        })
      };
      
      const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx, .xls',
      });
      
      const exportToExcel = () => {
        if (importedData) {
          const worksheet = XLSX.utils.aoa_to_sheet(importedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          XLSX.writeFile(workbook, 'registered_users.xlsx');
        }
      };
      const clearTable = () => {
        setImportedData(null);
      }

      //handle search 
      const[searchQuery, setSearchQuery] = useState('');
      const handleSearch = (event) => {
        setSearchQuery(event.target.value);
      }

      const filteredData = importedData
        ? importedData.slice(1).filter((row) => 
        row.some((cell) => cell.toString().toLowerCase().includes(searchQuery.toLowerCase())))
        : [];

        //get users list 

        const[usersList, setUsersList] = useState([]);
        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const response = await fetch('http://localhost:5000/user/list');

                    if ( !response.ok ) {
                        throw new Error('Network is not okay');
                    }
                    const data = response.json();

                    if(data && data.data) {
                        setUsersList(data.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            fetchUsers();
        }, []);
        console.log(usersList);
    return (
        <div className="dashboard">
            <header>
                <nav>
                    <h1>Dashboard</h1>
                </nav>
            </header>
            <div className="dashboard-tabs">
                <div className="search-tab">
                    <input type="text" 
                        name='search'
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder='search'
                    />
                </div>
                <div className="middle-tabs">
                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()}  type='file' placeholder='Import'/>
                        <label htmlFor="file-input">Import Excel</label>
                    </div>
                    <div className='button-tabs'>
                        <button onClick={exportToExcel}>Export to Excel</button>
                        <button onClick={clearTable}>Clear Table</button>
                    </div>
                    <div className="add-user">
                        <div className="add-icon">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <div className="add-text">
                            <p>add User</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="users-table">
                {importedData === null? (
                    <div className='table-data'>
                        No available Data
                    </div>
                ):(
                <div>
                <table>
                    <thead>
                    <tr>
                        {importedData[0].map((header, index) => (
                            <React.Fragment key={index}>
                            <th>{header}</th>
                            </React.Fragment>
                        ))}
                        <th>Delete</th>
                        <th>Edit</th>
                     </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {importedData[0].map((header, index) => (
                        <td key={index}>{row[index] || ''}</td>
                        ))}
                        <td>
                        <button>Delete</button>
                        </td>
                        <td><button>Edit</button></td>
                    </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;