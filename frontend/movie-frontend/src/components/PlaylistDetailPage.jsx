import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Movie from './Movie';

function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`https://ai-movie-recommendation-app.azurewebsites.net/api/playlists/${id}`);
        console.log("movies",response.data)
        setPlaylist(response.data.data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{playlist.name}</h1>
      {playlist.movies.map((movie) => (
        <Movie key={movie.title} movie={movie} />
      ))}
    </div>
  );
}

export default PlaylistDetailPage;
