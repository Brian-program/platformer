import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

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


  //ADD HEADERS FOR EACH OF THESE
  return (
    <Container>
      <div style={{fontSize: '32px', fontWeight:'bold', marginBottom:'10px', textAlign:'left' }}>
        TOP RATED
      </div>
      <MovieRow movies={topMovies} />

      <div style={{fontSize: '32px', fontWeight:'bold', marginBottom:'10px', textAlign:'left' }}>
        TOP ON NETFLIX
      </div>
      <MovieRow movies={topNetflix} />

      <div style={{fontSize: '32px', fontWeight:'bold', marginBottom:'10px', textAlign:'left' }}>
        TOP ON HULU
      </div>
      <MovieRow movies={topHulu} />

      <div style={{fontSize: '32px', fontWeight:'bold', marginBottom:'10px', textAlign:'left' }}>
        TOP ON DISNEY+
      </div>
      <MovieRow movies={topDisneyPlus} />

      <div style={{fontSize: '32px', fontWeight:'bold', marginBottom:'10px', textAlign:'left' }}>
        TOP ON PRIME VIDEO
      </div>
      <MovieRow movies={topPrimeVideo} />
    </Container>
  );
};