import { useEffect, useState } from 'react';
import { Button, Paper, Typography} from '@mui/material';
import { useParams } from 'react-router-dom';
import theme from '../theme';

//API key for OMDB API and import config file
const API_KEY = 'd2e25fe6';
const config = require('../config.json');

function MoviePage(props) {
  // State variables to store user ID, movie data, poster URL and detailed movie information
  const [userId, setUserId] = useState(props.user_id);
  const [movie, setMovie] = useState({});
  const [movieData, setMovieData] = useState({});
  const [posterUrl, setPosterUrl] = useState('');
  //Get movie ID from the URL params
  const { movieId } = useParams();

   //Function to check if movie data is present
  function isMoviePresent(movie) {
    return movie.length !== 0;
  }

  //Function to check if user is logged in
  function isLoggedIn(userId) {
    return userId !== "";
  }

  //UseEffect hook to fetch movie data from OMDb API and server
  useEffect(() => {
    async function fetchData() {
      //Fetch movie data from OMDb API
      const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}&plot=full`);
      const data = await response.json();
      //Set movie state variable
      setMovie(data);
      //Set movie poster URL state variable
      setPosterUrl(data.Poster);
    }
    //Call fetchData function
    fetchData();
    //Fetch movie data from server
    fetch(`http://${config.server_host}:${config.server_port}/movies/${movieId}`)
            .then(res => res.json())
            .then(resJson => setMovieData(resJson));
  }, [movieId]);

  //Function to add a movie to the user's watchlist
  function addToWatchlist(userId, titleId) {

     //Check if movie data is present
    if(isMoviePresent(movie)) {
      //Make a POST request to add the movie to the watchlist
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

  //Function to remove a movie from the user's watchlist
  function removeFromWatchlist(userId, titleId) {
     //Check if movie data is present
    if(isMoviePresent(movie)) {
      //Make a DELETE request to remove the movie from the watchlist
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

  //Functions to check if the movie is available on various streaming services
  const onNetflix = (movieData) => {
    return movieData.Netflix === null ? false : movieData.Netflix === 1;
  };
  
  const onHulu = (movieData) => {
    return movieData.Hulu === null ? false : movieData.Hulu === 1;
  };
  
  const onDisney = (movieData) => {
    return movieData.DisneyPlus === null ? false : movieData.DisneyPlus === 1;
  };
  
  const onPrime = (movieData) => {
    return movieData.PrimeVideo === null ? false : movieData.PrimeVideo === 1;
  };
  

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
