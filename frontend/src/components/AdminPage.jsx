import React, { useState } from "react";

function AdminPage() {
    const [about, setAbout] = useState('');
    const [date, setDate] = useState('');
    const [rsvps, setRsvps] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    return (
        <div className="admin-page">
            <form onSubmit={handleSubmit}>
                <label>About this event:</label>
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} />
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <label>RSVPs:</label>
                <input type="number" value={rsvps} onChange={(e) => setRsvps(e.target.value)} />
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default AdminPage;