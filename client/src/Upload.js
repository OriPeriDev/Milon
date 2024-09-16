import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

function Upload() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, definition }),
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
          />
        </div>
        <div>
          <label htmlFor="definition">Definition:</label>
          <textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Upload;