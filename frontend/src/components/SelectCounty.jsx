import React from 'react';

function SelectCounty() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    
    const[countyList, setCountyList] = useState([]);
    const County_API = `${process.env.REACT_APP_API_URL}/api/eventDetails`;
    
    useEffect(() => {
        fetch(County_API)
        .then(response => {
            if(!response.ok) {
                throw new Error('Error fetching event details');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                setCountyList(data.data);
                setLoading(false);
              } else {
                console.log('Unexpected data format:', data);
              }
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        })
    }, [County_API]);

    console.log('countyList',countyList);
    return (
        <div className="county-data">

        </div>
    )
}

export default SelectCounty;