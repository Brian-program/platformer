import React, { useState, useEffect } from 'react';
import { Container } from "@mui/system";
import { Typography } from '@mui/material';

import MovieGrid from "../components/MovieGrid";

const config = require('../config.json');

export default function Profile() {

    // const {user_id} = useParams();
    // const {search_id} = useParams();
    const temp_id = "brilu100";
    const [watchlistData, setWatchlistData] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${temp_id}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
    }, []);

    function isNotEmpty(array) {
      return array.length !== 0;
    }

    // console.log(watchlistData);

    return (
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          <b>Profile</b>
        </Typography>

        <Typography variant="h4" align="left" gutterBottom>
          <b>Watchlist</b>
        </Typography>

        {isNotEmpty(watchlistData) ? (
          <MovieGrid moviesData = {watchlistData}/>
        ) : (
          <p>Empty watchlist :v</p>
        )}
      </Container>
    );

};
