import React from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const MovieRow = ({ movies }) => {
  return (
    <div>
      {movies.map(movie => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <h3>{movie.titleId}</h3>
          <img src={movie.poster} alt={movie.title} />
          <p>{movie.title}</p>
          <Link component={NavLink} to={`/movies/${movie.id}`}>More Info</Link>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default MovieRow;
