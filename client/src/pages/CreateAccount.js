import React, { useState, useEffect } from 'react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';  
import { useNavigate } from 'react-router-dom';
import theme from '../theme';


const config = require('../config.json');


const CreateAccount = ({ user_id, setUser_id }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [actualLogin, setActualLogin] = useState([]); //fetched data to be checked
    const [status, setStatus] = useState(""); //displayed status if wrong

    const navigate = useNavigate();

    //if valid username and password that doesn't already exist, add and navigate to login
    useEffect(() => {
        if(isPasswordEmpty(password)) {
            setStatus("Password is Empty");
        } else if (!isActualLoginEmpty()) {
            setStatus("Username Already Used or Please Try AGAIN");
        } else if(!isPasswordEmpty(password)) {
            setStatus("");
            addToUsers(username, password);
            navigate('/login');
        }
    }, [actualLogin]);

    //calls the post method to add a user to users
    function addToUsers(userId, password) {
        fetch(`http://${config.server_host}:${config.server_port}/add_user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            password: password
        })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
      }   

      //checks if the username and password are valid
    const isValidLogin = (username, password) => {
        if(username !== "") {
        fetch(`http://${config.server_host}:${config.server_port}/user_login/${username}`)
            .then(res => res.json())
            .then(resJson => {
                setActualLogin(resJson);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    //checks if login is empty
    const isActualLoginEmpty = () => {
        return Array.isArray(actualLogin) && actualLogin.length === 0 || Object.keys(actualLogin).length === 0;
    }

    //checks if password is empty
    const isPasswordEmpty = () => {
        return password === "";
    }
  
    //returns a nice UI of create account 
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }}>
  <Card sx={{ backgroundColor: theme.palette.tertiary.main, maxWidth: 'sm', padding: 4 }}>
    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 520, letterSpacing: '.15rem' }}>
      CREATE ACCOUNT
    </Typography>
    <TextField
      id="outlined-basic"
      variant="outlined"
      label="Username"
      fullWidth
      margin="normal"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={{ backgroundColor: 'white'}}
    />
    <TextField
      id="outlined-basic"
      variant="outlined"
      label="Password"
      fullWidth
      margin="normal"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{ backgroundColor: 'white' }}
    />
    <Button
      variant="contained"
      fullWidth
      sx={{
        marginTop: 2,
        backgroundColor: theme.palette.primary.main,
        color: '#fff'
      }}
      onClick={() => isValidLogin(username, password)}
    >
      Create Account
    </Button>
    {status && (
      <>
        <Typography variant="body1" sx={{ color: 'red' }}>
          {status}
        </Typography>
      </>
    )}
  </Card>
</Box>
    );
  };
  
export default CreateAccount;
