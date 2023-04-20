import React from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const MovieRow = ({ movies }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    {movies.slice(0, 10).map((movie) => (
      <div key={movie.id} style={{ width: '10%', padding: '5px' }}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          style={{ width: '100%', height: 'auto' }}
        />
        <p style={{ textAlign: 'center', marginTop: '5px' }}>{movie.title}</p>
      </div>
    ))}
  </div>
  );
};

export default MovieRow;
