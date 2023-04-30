import React, { useState } from 'react';
import { Box, Button, Card, Divider, TextField, Typography } from '@mui/material';  
import { useNavigate } from 'react-router-dom';
import theme from '../theme';


const config = require('../config.json');


const Login = ({ user_id, setUser_id }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState([]);
    const [actualLogin, setActualLogin] = useState([]);
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    const isCorrectLogin = (username, password) => {
        fetch(`http://${config.server_host}:${config.server_port}/user_login/${username}`)
        .then(res => res.json())
        .then(resJson => {
            setActualLogin(resJson);
            console.log(actualLogin);
            if (isActualLoginEmpty()) {
                setStatus("Invalid Username or Password or Please Try AGAIN");
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '65vh' }}>
        <Card sx={{ backgroundColor: theme.palette.secondary.main, maxWidth: 'sm', padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            LOGIN
          </Typography>
          <TextField id="outlined-basic" 
												variant="outlined"
                        label="Username" 
                        fullWidth margin="normal" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        style={{ backgroundColor: 'white'}}/>
          <TextField id="outlined-basic" 
												variant="outlined"
                        label="Password" 
                        fullWidth margin="normal" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ backgroundColor: 'white'}}/>
          <Button variant="contained" fullWidth sx={{
            marginTop: 2,
            backgroundColor: theme.palette.primary.main,
            color: '#fff'
          }} onClick={() => isCorrectLogin(username, password)}>
            Login
          </Button>
          <Button variant="contained" fullWidth sx={{ marginTop: 2, backgroundColor: theme.palette.tertiary.main, }}>
            Create Account
          </Button>
          {status && (
            
            <Typography variant="body1" sx={{ color: 'red', textAlign: 'center' }}>
              <Divider sx={{ my: 2, color: theme.palette.secondary.main }} />
              {status}
            </Typography>
          )}
        </Card>

      </Box>
    );
  };
  

export default Login;
