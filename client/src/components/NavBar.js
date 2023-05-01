import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import theme from '../theme';
import { useState, useEffect } from 'react';

// name of the website
const WebsiteHome = ({ href, text }) => {
  return (
    <Typography
      variant="h1"
      noWrap
      style={{
        fontSize: '50px',
        marginRight: '30px',
        fontWeight: 700,
        letterSpacing: '.3rem',
        marginTop: '20px'
      }}
    >
      <NavLink
        to={href}
        style={{
          color: theme.palette.tertiary.main,
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
};

// creates buttons for lower half of nav bar
const NavText = ({ href, text }) => {
  return (
    <Button disableElevation
      component={NavLink}
      to={href}
      variant="contained"
      sx={{
        textAlign: "center",
        marginRight: '30px',
        fontFamily: theme.typography.h2,
        fontWeight: 500,
        letterSpacing: '.3rem',
        fontSize: '20px',
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.secondary.main,
        },
        flex: 1,
      }}
    >
      {text}
    </Button>
  );
};

// creates profile button in navbar
const Profile = ({ href, text }) => {
  return (
    <Button disableElevation
      component={NavLink}
      to={href}
      variant="contained"
      sx={{
        marginRight: '30px',
        fontFamily: theme.typography.h3,
        letterSpacing: '.3rem',
        fontWeight: 600,
        fontSize: '20px',
        color: theme.palette.tertiary.main,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.tertiary.main,
        },
      }}
    >
      {text}
    </Button>
  );
};

export default function NavBar(props) {

  const [userId, setUserId] = useState(props.user_id);

  useEffect(() => {
    setUserId(props.user_id);
  }, [props.user_id]);

  // returns full nav bar with title of website, and all other buttons
  return (
    <>
      <AppBar position="static" sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
            <WebsiteHome href="/" text="  FLIXFINDER" />
            {
            (userId === "" || userId === null) ? (<Profile href="/login" text="LOGIN" />) : (<Profile href="/profile" text="PROFILE" />)
            }
          </Toolbar>
          <Toolbar disableGutters sx={{ display: 'flex', gap: 0 }}>
            <NavText href="/" text="HOME" />
            <NavText href="/advanced_search" text="ADVANCED SEARCH" />
            <NavText href="/friendlist" text="MY FRIENDS" />
            <NavText href="/random" text="RANDOM" />
          </Toolbar>
        </Container>
      </AppBar>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>
    </>
    
  );
}
