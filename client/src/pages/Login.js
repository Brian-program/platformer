import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';  
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');


const Login = ({ user_id, setUser_id }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState([]);
    const [actualLogin, setActualLogin] = useState([]);

    const navigate = useNavigate();

    console.log(user_id);

    const [status, setStatus] = useState(""); //words that contains if status is null or not

    const isCorrectLogin = (username, password) => {
        fetch(`http://${config.server_host}:${config.server_port}/user_login/${username}`)
        .then(res => res.json())
        .then(resJson => {
            setActualLogin(resJson);
            console.log(actualLogin);
            if (isActualLoginEmpty()) {
                setStatus("Invalid Username or Password");
            } else if (isLoginValid()) {
                setStatus("");
                setUser_id(username);
                navigate('/profile');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const isActualLoginEmpty = () => {
        return actualLogin.length === 0;
    }

    const isLoginValid = () => {
        return actualLogin.password === password;
    }
  
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Container maxWidth="sm" sx={{ border: '1px solid black', padding: 2 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            LOGIN
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
          }} onClick={() => isCorrectLogin(username, password)}>
            Login
          </Button>
          <Button variant="outlined" fullWidth sx={{ marginTop: 2 }}>
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
  

export default Login;
