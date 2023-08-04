import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

function Movie({ movie }) {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {movie.title}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginTop: '10px' }}>
          {movie.description}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          href={movie.link} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginTop: '10px' }}
        >
          More Info
        </Button>
      </CardContent>
    </Card>
  );
}

export default Movie;