import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardMedia, Paper, Typography, Link } from '@mui/material';

import { NavLink } from 'react-router-dom';
import theme from '../theme';

const API_KEY = 'd2e25fe6';

const MovieRow = ({ movies }) => {
  const [posterUrls, setPosterUrls] = useState([]);

  useEffect(() => {
    async function fetchPosterUrls() {
      const urls = await Promise.all(movies.slice(0, 10).map(async (movie) => {
        const response = await fetch(`http://www.omdbapi.com/?i=${movie.titleId}&apikey=${API_KEY}`);
        const data = await response.json();
        return data.Poster;
      }));
      setPosterUrls(urls);
    }
    fetchPosterUrls();
  }, [movies]);

  const tallestButtonHeight = Math.max(...movies.slice(0, 10).map(movie => movie.height));


  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {movies.slice(0, 10).map((movie, index) => (
      <Paper
        elevation={0}
        key={movie.id}
        component={NavLink}
        to={`/movies/${movie.titleId}`}
        activeClassName="active"
        sx={{
          width: '10%',
          p: 1,
          backgroundColor: theme.palette.secondary.main,
          transition: 'transform 0.3s',
          '&:hover': {
            elevation: 1,
            backgroundColor: theme.palette.tertiary.main,
            cursor: 'pointer',
            transform: 'scale(1.1)', // Increase the scale on hover
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
          },
          height: `${tallestButtonHeight}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={posterUrls[index]}
          alt={movie.title}
          style={{ width: '100%', height: 'auto' }}
        />
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link
            component={NavLink}
            to={`/movies/${movie.titleId}`}
            underline="none"
            color="inherit"
          >
            {movie.title}
          </Link>
        </Typography>
      </Paper>
    ))}
    </div>
  );
};

export default MovieRow;
