import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/playlists');
        console.log("playlists", response.data)
        setPlaylists(response.data.data);
        
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
   
  }, []);

  return (
    <div>
      <h1>Playlists</h1>
      {playlists.map((playlist) => (
        <div key={playlist.ID}>
          <a href={`/playlists/${playlist.ID}`}>{playlist.name}</a>
        </div>
      ))}
    </div>
  );
}

export default PlaylistPage;
