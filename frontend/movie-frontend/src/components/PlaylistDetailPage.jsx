import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Snackbar, Button, CircularProgress } from '@material-ui/core';
import Movie from './Movie';

function PlaylistDetailPage() {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://ai-movie-recommendation-app.azurewebsites.net/api/playlists/${id}`);
                setPlaylist(response.data.data);
            } catch (error) {
              console.log(error)
              if (error.response) {
              setErrorMessage(error.response.data.error);
          } else {
              setErrorMessage(error.message);
          }
          setSnackbarOpen(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylist();
    }, [id]);

    const handleCloseSnackbar = () => {
        setErrorMessage("");
        setSnackbarOpen(false);
    };

    return (
        <div>
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {playlist && (
                        <>
                            <h1>{playlist.name}</h1>
                            {playlist.movies.map((movie) => (
                                <Movie key={movie.title} movie={movie} />
                            ))}
                        </>
                    )}
                </>
            )}
            <Snackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message={errorMessage}
                action={[
                    <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
                        Close
                    </Button>
                ]}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            />
        </div>
    );
}

export default PlaylistDetailPage;
