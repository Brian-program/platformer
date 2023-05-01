import { Grid, Typography } from '@mui/material';
import { Divider, Link, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import theme from '../theme';
import React from 'react';


const API_KEY = 'd2e25fe6';

export default function MovieGrid({moviesData, movieId}) {

  // gets the poster image url
  const [posterUrls, setPosterUrls] = useState({});
  
  // fetches the data from omdb api and places it into the grid
  useEffect(() => {
    async function fetchData() {
      // Promise.all to fetch all movie posters in parallel
      const urls = await Promise.all(moviesData.map(async (movie) => {
        const response = await fetch(`http://www.omdbapi.com/?i=${movie.titleId}&apikey=${API_KEY}`);
        const data = await response.json();
        return data.Poster;
      }));

      // Loop through the moviesData array and assign each poster URL to its corresponding titleId
      const newPosterUrls = {};
      for (let i = 0; i < moviesData.length; i++) {
        newPosterUrls[moviesData[i].titleId] = urls[i];
      }
      setPosterUrls(newPosterUrls);
    }

    // calls the defined functon above
    fetchData();
  }, [moviesData]);

  // popout grid of the entire watchlist for profile page
  return (
  <Paper variant="outlined" sx={{ backgroundColor: theme.palette.secondary.main}}>
  <Paper variant="outlined" sx={{ backgroundColor: theme.palette.secondary.main }}>
  <Grid container spacing={1} alignItems="stretch">
    {moviesData.map((movie, index) => (
      <React.Fragment key={movie.titleId}>
        {index % 6 === 0 && index !== 0 && (
          <Grid item xs={12}>
            <Divider />
          </Grid>
        )}
        <Grid item key={movie.titleId} xs={6} sm={4} md={3} lg={1.92}>
          <Paper
            elevation={0}
            key={movie.id}
            component={NavLink}
            to={`/movies/${movie.titleId}`}
            activeClassName="active"
            sx={{
              p: 2,
              backgroundColor: theme.palette.secondary.main,
              transition: 'transform 0.3s',
              '&:hover': {
                elevation: 1,
                backgroundColor: theme.palette.tertiary.main,
                cursor: 'pointer',
                transform: 'scale(1.1)',
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '-1px',
              height: '100%',
            }}
          >
            <img
              src={posterUrls[movie.titleId]}
              alt={movie.title}
              style={{ width: '100%', height: 'auto' }}
            />
            <Typography variant="body1" align="center" sx={{ mt: 1, letterSpacing: '0.05em' }}>
              <Link
                component={NavLink}
                to={`/movies/${movie.titleId}`}
                color="inherit"
                sx={{ fontSize: '1.1rem' }}
              >
                {movie.title}
              </Link>
            </Typography>
          </Paper>
        </Grid>
        {index % 6 !== 5 && (
          <Grid item>
            <Divider orientation="vertical" />
          </Grid>
        )}
      </React.Fragment>
    ))}
  </Grid>
  </Paper>

  </Paper>
  );
}
