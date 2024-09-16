import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [data, setData] = useState({ message: '', newRowId: null, rows: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="Home">
      {/* <h2>Dictionary Entries:</h2> */}
      <ul>
        {data.rows.map(row => (
          <li key={row.id}><h1 className='word'>{row.word}</h1>
          {row.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
