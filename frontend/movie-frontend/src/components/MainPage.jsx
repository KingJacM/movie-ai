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
    const [successOpen, setSuccessOpen] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

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
            try{
                if(response.data.movies != null){
                    setMovies(response.data.movies);
                    setShared(false)
                }else{
                    setErrorMessage("Data recieved, but is empty")
                    setSnackbarOpen(true);
                }
                

            } catch{
                setErrorMessage("Data recieved but failed to render");
                console.log("Data recieved but failed to render:", response.data)
                setSnackbarOpen(true);
            }
            
        } catch (error) {
            console.log(error)
            if (error.response) {
                setErrorMessage(error.response.data.error);
                if (error.response.data.content) {
                    console.log('Content from GPT:', error.response.data.content);
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
            setIsSharing(true);
            setShared(true)
            const response = await axios.post('https://ai-movie-recommendation-app.azurewebsites.net/api/playlists', { name: promptValue, movies });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            setSuccessOpen(true);
            setTimeout(() => setSuccessOpen(false), 6000);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage(error.message);
            }
            setShared(false)
            setSnackbarOpen(true); // Show the Snackbar when there's an error
        }finally {
            setIsSharing(false); // Ensure we set loading to false regardless of success or error
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
            {(movies != null && movies.length != 0) &&
            <Button style={{ marginTop:"20px"}}variant="contained" color="primary" onClick={handleSharePlaylist} disabled={shared || isLoading}>
                {isSharing ? <CircularProgress size={24} /> : 'Share your playlist'}
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
            <Snackbar
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message="Playlist successfully shared!"
                action={[
                    <Button color="secondary" size="small" onClick={() => setSuccessOpen(false)}>
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
