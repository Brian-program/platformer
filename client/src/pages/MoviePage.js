import { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function MoviePage() {
  const [movie, setMovie] = useState([]);
  const { movieId } = useParams();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movies/${movieId}`)
      .then(res => res.json())
      .then(resJson => setMovie(resJson));
  }, [movieId]);

  console.log(movie.titleId);
  
  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box
        p={3}
        m={2}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
      >
        <h1>{movie.title}</h1>
        <img
          src={movie.poster_url}
          alt={`${movie.title} poster`}
          style={{ maxWidth: '100%' }}
        />
        <p>Released: {movie.startYear}</p>
        {/* <p>Director: {movie.director}</p>
        <p>Cast: {movie.cast.join(', ')}</p>
        <p>Plot: {movie.plot}</p> */}
      </Box>
    </Container>
  );
}
