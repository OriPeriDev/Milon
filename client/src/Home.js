import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css';

function Home() {
  const [data, setData] = useState({ message: '', newRowId: null, rows: [] });
  const { setSelectedUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/hello`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleUserClick = (sub, userName) => {
    setSelectedUser({ sub, userName });
    navigate('/profile');
  };

  return (
    <div className="Home">
      {!data.rows ? (
        <p>No entries yet</p>
      ) : (
        data.rows.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {data.rows.map(row => (
              <li key={row.id}>
                <h3 className='word'>{row.word}</h3>
                <p className='definition'>{row.definition}</p>
                <p className='sub'>
                  By {row.sub ? (
                    <span 
                      onClick={() => handleUserClick(row.sub, row.userName)}
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                      {row.userName || 'Anonymous'}
                    </span>
                  ) : (
                    'Anonymous'
                  )}
                </p>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default Home;
