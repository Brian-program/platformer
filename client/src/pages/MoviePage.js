import { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const API_KEY = 'd2e25fe6';
const config = require('../config.json');

function MoviePage(props) {
  const [userId, setUserId] = useState(props.user_id);
  const [movie, setMovie] = useState({});
  const [movieData, setMovieData] = useState({});
  const [posterUrl, setPosterUrl] = useState('');
  const { movieId } = useParams();

  function isMoviePresent(movie) {
    return movie.length !== 0;
  }

  function isLoggedIn(userId) {
    return userId !== "";
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
      const data = await response.json();
      setMovie(data);
      setPosterUrl(data.Poster);
    }
    fetchData();
    fetch(`http://${config.server_host}:${config.server_port}/movies/${movieId}`)
            .then(res => res.json())
            .then(resJson => setMovieData(resJson));
  }, [movieId]);


  function addToWatchlist(userId, titleId) {

    if(isMoviePresent(movie)) {
      fetch(`http://${config.server_host}:${config.server_port}/add_watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          titleId: titleId
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }
  }    

  function removeFromWatchlist(userId, titleId) {
    if(isMoviePresent(movie)) {
      fetch(`http://${config.server_host}:${config.server_port}/remove_watchlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          titleId: titleId
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }
  }

  
  const onNetflix = (movieData) => {
    return movieData.Netflix === null ? false : movieData.Netflix === 1;
  };
  console.log("netflix", onNetflix(movieData));
  
  const onHulu = (movieData) => {
    return movieData.Hulu === null ? false : movieData.Hulu === 1;
  };
  console.log("hulu", onHulu(movieData));
  
  const onDisney = (movieData) => {
    return movieData.DisneyPlus === null ? false : movieData.DisneyPlus === 1;
  };
  console.log("disney", onDisney(movieData));
  
  const onPrime = (movieData) => {
    return movieData.PrimeVideo === null ? false : movieData.PrimeVideo === 1;
  };
  console.log("prime", onPrime(movieData));
  

  return (
    <Container maxWidth="md">
      <Box
        p={3}
        m={2}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', position: 'relative' }}
      >
        
        <h1>{movie.Title}</h1>
        <img
          src={posterUrl}
          alt={`${movie.Title}`}
          style={{ maxWidth: '100%' }}
        />

        <p>Released: {movie.Year}</p>
        <p>Description: {movie.Plot}</p>
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          {
          (isLoggedIn(userId)) ? (
            <div>
              <Button variant="contained" color="primary" onClick = {() => addToWatchlist(userId, movieId)} style={{ margin: '5px' }}>
                Add to Watchlist
              </Button>
            <Button variant="contained" color="secondary" onClick = {() => removeFromWatchlist(userId, movieId)} style={{ margin: '5px' }}>
              Remove From Watchlist
              </Button>
            </div>
            ) : <></> 
          }
          {
            (onNetflix(movieData)) ? (
              <p>Netflix</p>
            ) : <></>
          }
          {
            (onHulu(movieData)) ? (
              <p>Hulu</p>
            ) : <></>
          }
          {
            (onDisney(movieData)) ? (
              <p>Disney+</p>
            ) : <></>
          }
          {
            (onPrime(movieData)) ? (
              <p>Prime Video</p>
            ) : <></>
          }
        </div>
      </Box>
    </Container>
  );
}

export default MoviePage;
