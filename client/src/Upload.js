import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { useAuth0 } from '@auth0/auth0-react'; // Add this import

function Upload() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0(); // Add this line

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/add-word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          word, 
          definition,
          sub: isAuthenticated ? user.sub : null // Add this line
        }),
      });
      const data = await response.json();
      console.log(data);
      // Clear form after successful submission
      setWord('');
      setDefinition('');
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Upload">
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="word">Word:</label>
          <input
            type="text"
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="definition">Definition:</label>
          <textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Upload;