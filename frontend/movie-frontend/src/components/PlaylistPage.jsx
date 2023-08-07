import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Paper, Typography, makeStyles, Snackbar, Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

function PlaylistPage() {
  const classes = useStyles();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://ai-movie-recommendation-app.azurewebsites.net/api/playlists');
            setPlaylists(response.data.data);
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

    fetchPlaylists();
}, []);

const handleCloseSnackbar = () => {
  setErrorMessage("");
  setSnackbarOpen(false);
};

return (
  <div>
      <Paper className={classes.root}>
          <Typography variant="h4" className={classes.title}>
              Playlists
          </Typography>
          {isLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                  <CircularProgress />
              </div>
          ) : (
              <List>
                  {playlists.map((playlist) => (
                      <ListItem key={playlist.ID} button component={Link} to={`/playlists/${playlist.ID}`}>
                          <ListItemText primary={playlist.name} />
                      </ListItem>
                  ))}
              </List>
          )}
      </Paper>
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

export default PlaylistPage;
