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
      <MovieRow movies={topMovies} />
      <MovieRow movies={topNetflix} />
      <MovieRow movies={topHulu} />
      <MovieRow movies={topDisneyPlus} />
      <MovieRow movies={topPrimeVideo} />
    </Container>
  );
};