import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import theme from '../theme';


import MovieRow from '../components/MovieRow';
const config = require('../config.json');

export default function Home() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [topMovies, setTopMovies] = useState([]);
  const [topNetflix, setTopNetflix] = useState([]);
  const [topHulu, setTopHulu] = useState([]);
  const [topPrimeVideo, setTopPrimeVideo] = useState([]);
  const [topDisneyPlus, setTopDisneyPlus] = useState([]);


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top_movies`)
      .then(res => res.json())
      .then(resJson => setTopMovies(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/top_DisneyPlus`)
      .then(res => res.json())
      .then(resJson => setTopDisneyPlus(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/top_PrimeVideo`)
      .then(res => res.json())
      .then(resJson => setTopPrimeVideo(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/top_hulu`)
      .then(res => res.json())
      .then(resJson => setTopHulu(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/top_netflix`)
      .then(res => res.json())
      .then(resJson => setTopNetflix(resJson));
  }, []);

  return (
    <Container>
            <Card sx={{backgroundColor: theme.palette.secondary.main, width: '100%'}}>
        <CardContent>
          <Box sx={{ padding: 1, }}>
            <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '36px', textAlign: 'left', marginLeft: '10px', marginBottom: '6px'}}>
              TOP RATED
            </Typography>
            <MovieRow movies={topMovies} />
          </Box>
        </CardContent>
      </Card>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>

      <Card sx={{backgroundColor: theme.palette.secondary.main}}>
        <CardContent>
          <Box sx={{ padding: 1}}>
            <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '36px', textAlign: 'left', marginLeft: '10px', marginBottom: '6px'}}>
              TOP ON NETFLIX
            </Typography>
        <MovieRow movies={topNetflix} />
        </Box>
        </CardContent>
      </Card>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>

      <Card sx={{backgroundColor: theme.palette.secondary.main}}>
        <CardContent>
          <Box sx={{ padding: 1}}>
            <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '36px', textAlign: 'left', marginLeft: '10px', marginBottom: '6px'}}>
              TOP ON HULU
        </Typography>
        <MovieRow movies={topHulu} />
        </Box>
        </CardContent>
      </Card>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>

      <Card sx={{backgroundColor: theme.palette.secondary.main}}>
        <CardContent>
          <Box sx={{ padding: 1}}>
            <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '36px', textAlign: 'left', marginLeft: '10px', marginBottom: '6px'}}>
              TOP ON DISNEY+
        </Typography>
        <MovieRow movies={topDisneyPlus} />
        </Box>
        </CardContent>
      </Card>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>

      <Card sx={{backgroundColor: theme.palette.secondary.main}}>
        <CardContent >
          <Box sx={{ padding: 1}}>
            <Typography variant="h2" sx={{ fontWeight: 500, fontSize: '36px', textAlign: 'left', marginLeft: '10px', marginBottom: '6px'}}>
              TOP ON PRIME VIDEO
        </Typography>
        <MovieRow movies={topPrimeVideo} />
        </Box>
        </CardContent>
      </Card>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>
    </Container>
  );

};