import { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const API_KEY = 'd2e25fe6';

function MoviePage() {
  const [movie, setMovie] = useState({});
  const [posterUrl, setPosterUrl] = useState('');
  const { movieId } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
      const data = await response.json();
      setMovie(data);
      setPosterUrl(data.Poster);
    }
    fetchData();
  }, [movieId]);

  return (
    <Container maxWidth="md">
      <Box
        p={3}
        m={2}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000' }}
      >
        <Button variant="contained" color="primary" style={{ float: 'right', margin: '5px' }}>Delete from Watchlist</Button>
        <Button variant="contained" color="secondary" style={{ float: 'right', margin: '5px' }}>Add To Watchlist</Button>
        <h1>{movie.Title}</h1>
        <img
          src={posterUrl}
          alt={`${movie.Title}`}
          style={{ maxWidth: '100%' }}
        />

        <p>Released: {movie.Year}</p>
      </Box>
    </Container>
  );
}

export default MoviePage;
