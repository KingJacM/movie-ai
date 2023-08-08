import React from 'react';
import { Card, CardContent, Typography, Button, CardMedia } from '@material-ui/core';

function Movie({ movie }) {
  return (
    <Card  style={{ marginBottom: '20px', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }}>
      {movie.ImageLink && (
        <CardMedia
          component="img"
          alt={movie.title}
          height="140"
          image={movie.ImageLink}
          title={movie.title}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="h2">
          {movie.title}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginTop: '10px' }}>
          {movie.description}
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          href={movie.link} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginTop: '10px' }}
        >
          more info
        </Button>
      </CardContent>
    </Card>
  );
}

export default Movie;
