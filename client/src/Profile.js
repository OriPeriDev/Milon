import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from './UserContext';
import './Profile.css';

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userWords, setUserWords] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const { selectedUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (selectedUser) {
          // Fetch user data for the selected user
          const response = await axios.get(`http://localhost:5000/api/user`, { params: { sub: selectedUser.sub } });
          setProfileUser(response.data.data);
        } else if (isAuthenticated && user) {
          // Fetch user data for the logged-in user
          setProfileUser(user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [selectedUser, isAuthenticated, user]);

  useEffect(() => {
    const fetchUserWords = async () => {
        try {
            console.log(profileUser);
          const response = await axios.get(`http://localhost:5000/api/user-words`, { params: { sub: profileUser.user_id } });
          setUserWords(response.data.words);
        } catch (error) {
          console.error('Error fetching user words:', error);
        }
    };

    fetchUserWords();
  }, [profileUser]);

  if (isLoading) {
    return <div className="Profile loading">Loading...</div>;
  }

  return (
    <div className="Profile">
        {profileUser ? (
        <>
      <h2>{profileUser.nickname}'s Profile</h2>
      
          <h3>User's Words</h3>
          {userWords.length > 0 ? (
            <ul>
              {userWords.map(word => (
                <li key={word.id}>
                  <strong>{word.word}</strong>
                  <p>{word.definition}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-words">This user hasn't added any words yet.</p>
          )}
        </>
      ) : (
        <p>Lodaing...</p>
      )}
    </div>
  );
}

export default Profile;
