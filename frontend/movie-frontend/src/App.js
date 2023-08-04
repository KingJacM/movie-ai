import './App.css';
import React from 'react';
import MainPage from './components/MainPage';
import { CssBaseline, Container } from '@material-ui/core';

function App() {
    return (
        <div>
            <CssBaseline />
            <Container maxWidth="md">
                <MainPage />
            </Container>
        </div>
    );
}

export default App;