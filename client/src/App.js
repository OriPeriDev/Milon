import React, { useState, useEffect, useRef } from 'react';
import { UserProvider } from './UserContext';
import { Link, Routes, Route, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Home from './Home';
import Upload from './Upload';
import './App.css';
import Profile from './Profile';
import { useUser } from './UserContext';


function NavBar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { setSelectedUser } = useUser();
  const { sub } = user || {};
  const userName = user?.nickname || user?.name || 'Anonymous';

  useEffect(() => {
    if (isAuthenticated && user) {
      setSelectedUser({ sub, userName });
    }
  }, [isAuthenticated, user, setSelectedUser, sub, userName]);


  const handleProfileClick = () => {
    setShowMenu(false);
    setSelectedUser({ sub, userName });
    navigate('/profile');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">Home</Link>
      </div>
      <div className="nav-right">
        <Link to="/upload">Upload</Link>
        {isAuthenticated ? (
          <div className="profile-container" ref={menuRef}>
            <img
              src={user.picture}
              alt="Profile"
              className="profile-picture"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="profile-menu">
                <button onClick={handleProfileClick}>Profile</button>
                <button onClick={() => {
                  setShowMenu(false);
                  logout({ returnTo: window.location.origin });
                }}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <UserProvider>
        <Auth0Provider
          domain="dev-41ozi2fi1i62dr0r.us.auth0.com"
          clientId="irf2eaSGHZVLto5rFD6EASv30IT9o9P6"
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        >
          <div className="App">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Auth0Provider>
    </UserProvider>
  );
}

export default App;