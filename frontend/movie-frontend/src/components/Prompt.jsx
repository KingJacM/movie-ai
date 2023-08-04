import React from 'react';
import { TextField, Button, Grid } from '@material-ui/core';

function Prompt({ onSubmit, disabled, inputValue, onInputChange }) {
    return (
        <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ marginTop: '20px' }}>
            <Grid item xs={8}>
                <TextField
                    id="movie-prompt"
                    label="Enter type of movie"
                    variant="outlined"
                    fullWidth
                    value={inputValue}
                    onChange={onInputChange}
                    disabled={disabled}
                />
            </Grid>
            <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={onSubmit} disabled={disabled}>
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
}

export default Prompt;