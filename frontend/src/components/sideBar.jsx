import React, { useState } from 'react';
import '../Styles/component.css'; // Import CSS file for sidebar styles

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsOpen(isOpen);
  };

  const handleLogout = () => {
    window.location.href = "/login";
    alert("Logout Successfully");
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className='side_head'>TaskTracker</h2>
        <button className="toggle-btn" onClick={handleToggleSidebar}>
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li className='side_link'><a href="/home">Dashboard</a></li>
        <li className='side_link'><a href="/home">Home</a></li>
        <li className='side_link'><a href="/home">Home</a></li>
      </ul>
      <div className="logout_btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
