import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import Header from '../components/Header';
const config = require('../config.json');

export default function Home() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [topMovies, setTopMovies] = useState({});

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/`)
      .then(res => res.json())
      .then(resJson => setTopMovies(resJson));

  }, []);

  return (
    <Container>
      <Header></Header>
    </Container>
  );
};