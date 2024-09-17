import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './Home.css';

function Home() {
  const [data, setData] = useState({ message: '', rows: [], totalCount: 0, hasMore: true });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setSelectedUser } = useUser();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/hello?page=${page}`);
      setData(prevData => ({
        ...response.data,
        rows: [...prevData.rows, ...response.data.rows]
      }));
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUserClick = (sub, userName) => {
    setSelectedUser({ sub, userName });
    navigate('/profile');
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !loading &&
      data.hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, data.hasMore]);

  return (
    <div className="Home">
      {data.rows.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {data.rows.map(row => (
              <li key={row.id}>
                <h3 className='word'>{row.word}</h3>
                <p className='definition'>{row.definition}</p>
                <p className='sub'>
                  By {row.sub ? (
                    <span 
                      onClick={() => handleUserClick(row.sub, row.userName)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
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
          {loading && <p>Loading more...</p>}
          {/* {!data.hasMore && <p>No more entries to load.</p>} */}
        </>
      )}
    </div>
  );
}

export default Home;
