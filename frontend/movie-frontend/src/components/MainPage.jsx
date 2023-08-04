import React, { useState, useEffect } from 'react';
import Prompt from './Prompt';
import Suggestion from './Suggestion';
import Movie from './Movie';
import axios from 'axios';
import { Button } from '@material-ui/core';

const movies_list = [
    {
        title: "movie 1",
        description: "1111",
        link: "https://google.com"
    },
    {
        title: "movie 2",
        description: "2222",
        link: "https://google.com"
    },
    {
        title: "movie 3",
        description: "3333",
        link: "https://google.com"
    }
]

function MainPage() {
    const [promptValue, setPromptValue] = useState("");
    const [movies, setMovies] = useState(movies_list);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        setPromptValue(event.target.value);
    };

    const handlePromptSubmit = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/recommendations', { prompt: promptValue });
            setMovies(response.data.movies);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }

        setIsLoading(false);
    };

    const handleSharePlaylist = async () => {
        try {
            await axios.post('http://localhost:8080/api/playlists', { name: promptValue, movies });
        } catch (error) {
            console.error('Error sharing playlist:', error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setPromptValue(suggestion);
        // handlePromptSubmit();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Suggestion onSuggestionClick={handleSuggestionClick} disabled={isLoading} />
            <Prompt onSubmit={handlePromptSubmit} disabled={isLoading} inputValue={promptValue} onInputChange={handleInputChange} >
            </Prompt>
            <Button variant="contained" color="primary" onClick={handleSharePlaylist} disabled={isLoading}>
                Share your playlist
            </Button>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ display: 'flex', marginTop: "20px", flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {movies.map((movie, index) => (
                        <div style={{ flexBasis: '30%', marginBottom: '1rem' }}>
                            <Movie key={index} movie={movie} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MainPage;
