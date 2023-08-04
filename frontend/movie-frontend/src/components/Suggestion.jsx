import React, { useState, useEffect } from 'react';
import { Button, Fade } from '@material-ui/core';

const suggestions = [
  "I'm in the mood for a comedy.",
  "Recommend a movie that has won an Oscar.",
  "I want to watch a horror movie.",
  "Suggest a sci-fi movie.",
];

function Suggestion({ onSuggestionClick, disabled }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in={true} timeout={1000} key={suggestions[index]} style={{ marginTop: '20px' }}>
      <Button 
        variant="contained" 
        color="primary" 
        disabled={disabled}
        onClick={() => onSuggestionClick(suggestions[index])}
        
      >
        {suggestions[index]}
      </Button>
    </Fade>
  );
}

export default Suggestion;