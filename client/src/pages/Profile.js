import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from "@mui/system";
import { Typography, Button } from '@mui/material';


import MovieGrid from "../components/MovieGrid";

const config = require('../config.json');

export default function Profile(props) {

    //const [loginId, setLoginId] = useState(props.login_id); to set login, but don't need here
    const [userId, setUserId] = useState(props.user_id);
    const { searchId } = useParams();

    const [watchlistData, setWatchlistData] = useState([]);

    console.log(userId);
    // console.log(searchId);

    function isSearchIdNotNull(searchId) {
      return typeof searchId !== 'undefined';
    }

    useEffect(() => {
      if(isSearchIdNotNull(searchId)) {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${searchId}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
      } else {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${userId}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
      }
    }, [searchId, userId]);

    function isNotEmpty(array) {
      return array.length !== 0;
    }

    function addToFollowings(userId, followId) {
      fetch('/api/followings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          followId: followId
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }    

    
    function removeFromFollowings(userId, followId) {
      fetch('/api/followings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          followId: followId
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
    }
    

    // console.log(watchlistData);

    return (
      <Container>
        <Typography variant="h3" align="center" gutterBottom>
          <b>Profile : {isSearchIdNotNull(searchId) ? searchId : userId}</b>
        </Typography>

        <div style={{ display: "flex" }}>
          <Button variant="contained" color="primary">
            Add To Friends List
          </Button>
          <Button variant="contained" color="secondary">
            Remove From Friends List
          </Button>
        </div>

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
