import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [data, setData] = useState({ message: '', newRowId: null, rows: [] });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/hello`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

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
                <p className='sub'>By {row.userName || 'Anonymous'}</p>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default Home;
