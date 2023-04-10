import React, { useState } from 'react';

function Header() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  };

  return (
    <header>
      <div className="header-top">
        {isLoggedIn ? (
          <button className="login-button" onClick={handleLogoutClick}>
            Profile
          </button>
        ) : (
          <button className="login-button" onClick={handleLoginClick}>
            Log in
          </button>
        )}
        <div className="search-bar">
          <input type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search" />
          <button>Search</button>
        </div>
      </div>
      <nav>
        <ul>
          <li className={activeTab === 'home' ? 'active' : ''} onClick={() => handleTabClick('home')}>
            Home
          </li>
          <li className={activeTab === 'filter' ? 'active' : ''} onClick={() => handleTabClick('filter')}>
            Filter
          </li>
          <li className={activeTab === 'community' ? 'active' : ''} onClick={() => handleTabClick('community')}>
            Community
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
