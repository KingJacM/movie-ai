import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@material-ui/core';

import MainPage from './components/MainPage';
import PlaylistPage from './components/PlaylistPage';
import PlaylistDetailPage from './components/PlaylistDetailPage';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4C4C6D',  // Almost black (like a classic movie theater curtain)
    },
    secondary: {
      main: '#FFD700',  // Golden (like an Oscar statue)
    },
    
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <img style={{ height: "40px" }} src="movie-logo.png" alt="Movie Logo" />
              </div>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/playlists">Playlists</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/playlists" element={<PlaylistPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
        </Container>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
