import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@material-ui/core';

import MainPage from './components/MainPage';
import PlaylistPage from './components/PlaylistPage';
import PlaylistDetailPage from './components/PlaylistDetailPage';

function App() {
  return (
    <Router>
      <div>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Movie Recommendation
            </Typography>
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
  );
}

export default App;
