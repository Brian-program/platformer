import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from "@mui/system";
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieGrid from "../components/MovieGrid";

const config = require('../config.json');

export default function Profile(props) {

    const [userId, setUserId] = useState(props.user_id);
    const [watchlistData, setWatchlistData] = useState([]);
    const [friend, setFriend] = useState([]);
    const { searchId } = useParams();
    const navigate = useNavigate();

    // returns true is searchId is not null
    function isSearchIdNotNull(searchId) {
      return typeof searchId !== 'undefined';
    }

    // checks if user is logged in
    function isLoggedIn(userId) {
      return userId !== "";
    }

    // check if the current searched profile is a friend
    function isNotFriends(friend) {
      return friend.length === 0;
    }

    //pulls data based on who's profile
    useEffect(() => {
      if(isSearchIdNotNull(searchId)) {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${searchId}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
          if(isLoggedIn(userId)) {
            fetch(`http://${config.server_host}:${config.server_port}/getFriend/${userId}/${searchId}`)
            .then(res => res.json())
            .then(resJson => setFriend(Array.isArray(resJson) ? resJson : []));
          }
      } else {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${userId}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
      }
    }, [searchId, userId]);

    // checks if data pulled is not empty
    function isNotEmpty(array) {
      return array.length !== 0;
    }

    // add friend to friendlist and then navigate to friends page
    function addToFollowings(userId, followId) {
      if(isNotFriends(friend)) {
        fetch(`http://${config.server_host}:${config.server_port}/add_friendlist`, {
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
        navigate("/friendlist");
      }
    }    

    // delete friend from friendlist and then navigate to friends page
    function removeFromFollowings(userId, followId) {
      fetch(`http://${config.server_host}:${config.server_port}/remove_friendlist`, {
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
      navigate("/friendlist");
    }

    // returns a profile if logged in which includes nice UI for the watchlist and buttons to add/remove if user is not yourself
    return (
      <Container>
        <Typography variant="h3" align="left" display="flex" alignItems="center" gutterBottom>
  <b>{isSearchIdNotNull(searchId) ? searchId : userId}'s Watchlist</b>
  <div style={{ marginLeft: 'auto' }}>
    {!isSearchIdNotNull(searchId) && isLoggedIn(userId) && (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // resetUser();
          navigate('/logout');
        }}
      >
        LOGOUT
      </Button>
    )}
    {(isSearchIdNotNull(searchId) && isLoggedIn(userId)) && (
      <>
        <Button variant="contained" color="primary" onClick={() => addToFollowings(userId, searchId)}>
          Add To Friends List
        </Button>
        <Button variant="contained" color="tertiary" onClick={() => removeFromFollowings(userId, searchId)}>
          Remove From Friends List
        </Button>
      </>
    )}
  </div>
</Typography>
        {isNotEmpty(watchlistData) ? (
          <MovieGrid moviesData = {watchlistData}/>
        ) : (
          <p>Empty watchlist :v</p>
        )}
      </Container>
    );

};
