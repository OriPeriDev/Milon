import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';


function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { setSelectedUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    
    if (query) {
      axios.get(`http://localhost:5000/api/search`, {
        params: { q: query }
      })
        .then(response => {
          setResults(response.data.results);
          setLoading(false);
          console.log(response);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        }); 
    }
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleUserClick = (sub, userName) => {
    setSelectedUser({ sub, userName });
    navigate('/profile');
  };

  return (
    <div className="Home">
      <h2>Search Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <h3 className="word">{result.word}</h3>
              <p className="definition">{result.definition}</p>
              <p className="sub">
               By {result.sub ? (
                    <span 
                      onClick={() => handleUserClick(result.sub, result.userName)}
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {result.userName || 'Anonymous'}
                    </span>
                  ) : (
                    'Anonymous'
                  )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;
