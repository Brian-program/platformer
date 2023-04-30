import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';  
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');


const CreateAccount = ({ user_id, setUser_id }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [actualLogin, setActualLogin] = useState([]);
    const [status, setStatus] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        console.log("user", username);
        console.log("pass", password);
        console.log("actualLogin", actualLogin);
        if(isPasswordEmpty(password)) {
            setStatus("Invalid Password");
        } else if (!isActualLoginEmpty()) {
            setStatus("Username Already Used or Please Try AGAIN");
        } else if(!isPasswordEmpty(password)) {
            setStatus("");
            addToUsers(username, password);
            //create the account into database
            navigate('/login');
        }
    }, [actualLogin]);

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


    const isActualLoginEmpty = () => {
        return Array.isArray(actualLogin) && actualLogin.length === 0 || Object.keys(actualLogin).length === 0;
    }

    const isPasswordEmpty = () => {
        return password === "";
    }
  
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Container maxWidth="sm" sx={{ border: '1px solid black', padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            CREATE ACCOUNT
          </Typography>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" fullWidth sx={{
            marginTop: 2,
            backgroundColor: '#00bcd4',
            '&:hover': {
              backgroundColor: '#4caf50',
            },
            color: '#fff'
          }} onClick={() => isValidLogin(username, password)}>
            Create Account
          </Button>
        {status && (
            <Typography variant="body1" sx={{ color: 'red' }}>
            {status}
            </Typography>
        )}
        </Container>
      </Box>
    );
  };
  

export default CreateAccount;
