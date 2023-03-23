import React, { useState } from 'react';
import './header.scss';

const Header = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.location.href = `/${tab}`;
  };

  return (
    <div>
      <div className="header">
        <h1>DocuSense</h1>
      </div>
      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => handleTabClick('upload')}>File Upload</button>
        <button className={`tab-button ${activeTab === 'search' ? 'active' : ''}`} onClick={() => handleTabClick('search')}>Search</button>
      </div>
    </div>
  );
};

export default Header;
