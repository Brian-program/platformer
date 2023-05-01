import { useEffect, useState } from 'react';
import { Button, Paper, Typography} from '@mui/material';
import { useParams } from 'react-router-dom';
import theme from '../theme';

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
      const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}&plot=full`);
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
  
    <Paper
  variant="outlined"
  sx={{
    p: 3,
    m: { xs: 2, md: 4 },
    backgroundColor: theme.palette.tertiary.main,
    borderRadius: '16px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 1)',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
  }}
>
  <div style={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
    <img
      src={posterUrl}
      alt={`${movie.Title}`}
      style={{ maxWidth: '50%', marginRight: '20px', alignSelf: 'flex-start' }}
    />

    <div>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0 }}>
        {movie.Title}
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
          Released: {movieData.startYear}
        </Typography>
        {isLoggedIn(userId) && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => addToWatchlist(userId, movieId)}
            sx={{ margin: '5px', padding: '8px 16px' }}
          >
            Add to Watchlist
          </Button>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold',mt: 1 }}>
          Rating: {movieData.rating}
        </Typography>
        {isLoggedIn(userId) && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => removeFromWatchlist(userId, movieId)}
            sx={{ margin: '5px', padding: '8px 16px' }}
          >
            Remove From Watchlist
          </Button>
        )}
      </div>
      
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline', mt: 1 }}>
        Synopsis:
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 0 }}>
        {movie.Plot}
      </Typography>


      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
        
      </div>
    </div>
  </div>

  <div style={{ marginTop: 'auto' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
      AVAILABLE ON:
    </Typography>
    {onNetflix(movieData) && (
      <Button
      variant="contained"
      color="info"
      sx={{
        margin: '5px',
        padding: '8px 16px',
        backgroundColor: '#E50914',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#B4060C',
        },
      }}
      onClick={() => window.open('https://www.netflix.com', '_blank')}
    >
      Netflix
    </Button>
    
    )}
    {onHulu(movieData) && (
      <Button
      variant="contained"
      color="info"
      sx={{
        margin: '5px',
        padding: '8px 16px',
        backgroundColor: '#3DBB3D',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#2CA52C',
        },
      }}
      onClick={() => window.open('https://www.hulu.com', '_blank')}
    >
      Hulu
    </Button>
    )}
    {onDisney(movieData) && (
      <Button
      variant="contained"
      color="info"
      sx={{
        margin: '5px',
        padding: '8px 16px',
        backgroundColor: '#0B5A9F',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#0A4C8E',
        },
      }}
      onClick={() => window.open('https://www.disneyplus.com', '_blank')}
    >
      Disney+
    </Button>
    
    
    )}
    {onPrime(movieData) && (
      <Button
      variant="contained"
      color="info"
      sx={{
        margin: '5px',
        padding: '8px 16px',
        backgroundColor: '#00A8E1',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#0071A4',
        },
      }}
      onClick={() => window.open('https://www.amazon.com/gp/video/storefront/ref=atv_hm_hom_legacy_redirect?contentId=IncludedwithPrime&contentType=merch&merchId=IncludedwithPrime', '_blank')}
    >
      Amazon Prime
    </Button>
    
    )}
  </div>
</Paper>

  

  
  );
}

export default MoviePage;
