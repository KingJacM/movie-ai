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
      main: '#1976d2',
    },
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
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
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Movie AI: What to Watch
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
    </ThemeProvider>
  );
}

export default App;
