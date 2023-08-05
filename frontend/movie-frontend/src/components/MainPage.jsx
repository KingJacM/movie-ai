import React, { useState, useEffect } from 'react';
import Prompt from './Prompt';
import Suggestion from './Suggestion';
import Movie from './Movie';
import axios from 'axios';
import { Button , CircularProgress, Snackbar  } from '@material-ui/core';

function MainPage() {
    const [promptValue, setPromptValue] = useState("");
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [shared, setShared] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleInputChange = (event) => {
        setPromptValue(event.target.value);
    };

    const handlePromptSubmit = async () => {
        setIsLoading(true);
    
        try {
            const response = await axios.post('https://ai-movie-recommendation-app.azurewebsites.net/api/recommendations', { prompt: promptValue });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setMovies(response.data.movies);
        } catch (error) {
            console.log(error)
            if (error.response) {
                setErrorMessage(error.response.data.error);
                if (error.response.data.content) {
                    console.log('Content from OpenAI:', error.response.data.content);
                }
            } else {
                setErrorMessage(error.message);
            }
            setSnackbarOpen(true); // Show the Snackbar when there's an error
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleSharePlaylist = async () => {
        try {
            setShared(true)
            const response = await axios.post('http://ai-movie-recommendation-app.azurewebsites.net/api/playlists', { name: promptValue, movies });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage(error.message);
            }
            setSnackbarOpen(true); // Show the Snackbar when there's an error
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setPromptValue(suggestion);
        // handlePromptSubmit();
    };

    const handleCloseSnackbar = () => {
        setErrorMessage("");
        setSnackbarOpen(false); // <-- Add this line
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Suggestion onSuggestionClick={handleSuggestionClick} disabled={isLoading} />
            <Prompt onSubmit={handlePromptSubmit} disabled={isLoading} inputValue={promptValue} onInputChange={handleInputChange} >
            </Prompt>
            {movies.length !== 0 &&
            <Button variant="contained" color="primary" onClick={handleSharePlaylist} disabled={shared || isLoading}>
                Share your playlist
            </Button>}
            {isLoading ? (
                <div style={{ marginTop:"20px", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                    <p style={{ marginTop: '10px' }}>Fetching recommendations...</p>
                </div>
            ) : (
                <div style={{ display: 'flex', marginTop: "20px", flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {movies.map((movie, index) => (
                        <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
                            <Movie key={index} movie={movie} />
                        </div>
                    ))}
                </div>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
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

export default MainPage;
