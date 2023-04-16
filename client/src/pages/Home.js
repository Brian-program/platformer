import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import MovieRow from '../components/MovieRow';
const config = require('../config.json');

export default function Home() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [topMovies, setTopMovies] = useState({});
  const [topNetflix, setTopNetflix] = useState({});
  const [topHulu, setTopHulu] = useState({});
  const [topPrimeVideo, setTopPrimeVideo] = useState({});
  const [topDisneyPlus, setTopDisneyPlus] = useState({});


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top_movies`)
      .then(res => res.json())
      .then(resJson => setTopMovies(resJson));
  }, []);



  return (
    <Container>
      <MovieRow movies={topMovies} />
      {/* <div>
        {topMovies.map(movie => (
          <div>
            <h3>{movie.titleId}</h3>
            <img src={movie.poster} alt={movie.title} />
            <p>{movie.title}</p>
            <Link component={NavLink} to={`/movies/${movie.id}`}>More Info</Link>
            <Divider />
          </div>
        ))}
      </div> */}
      {/* <MovieRow movies={topNetflix} />
      <MovieRow movies={topHulu} />
      <MovieRow movies={topDisneyPlus} />
      <MovieRow movies={topPrimeVideo} /> */}
    </Container>
  );
};