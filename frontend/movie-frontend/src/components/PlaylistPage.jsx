import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Paper, Typography, makeStyles } from '@material-ui/core';
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

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://ai-movie-recommendation-app.azurewebsites.net/api/playlists');
        setPlaylists(response.data.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Playlists
      </Typography>
      <List>
        {playlists.map((playlist) => (
          <ListItem key={playlist.ID} button component={Link} to={`/playlists/${playlist.ID}`}>
            <ListItemText primary={playlist.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default PlaylistPage;
