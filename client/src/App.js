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

function CursorTailwind() {
  const cursorDotOutline = useRef(null);
  const cursorDot = useRef(null);

  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const mouseMoveHandler = (event) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", mouseMoveHandler);

    const resizeHandler = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const animateDotOutline = (time) => {
    if (previousTimeRef.current !== undefined) {
      const { x, y } = mousePosition;
      const dotOutline = cursorDotOutline.current;
      const dot = cursorDot.current;

      dotOutline.style.top = `${y}px`;
      dotOutline.style.left = `${x}px`;
      dotOutline.style.opacity = "1";

      dot.style.top = `${y}px`;
      dot.style.left = `${x}px`;
      dot.style.opacity = "1";
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateDotOutline);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateDotOutline);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePosition]);

  return (
    <>
      <div ref={cursorDotOutline} className="cursor-dot-outline"></div>
      <div ref={cursorDot} className="cursor-dot"></div>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
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
          <CursorTailwind />
        </div>
      </Auth0Provider>
    </UserProvider>
  );
}

export default App;