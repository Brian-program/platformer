import { AppBar, Container, Toolbar, Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import theme from '../theme';

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

export default function NavBar() {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters style={{ display: 'flex', justifyContent: 'space-between' }}>
            <WebsiteHome href="/" text="  FLIXFINDER" />
            <Profile href="/profile" text="PROFILE" />
          </Toolbar>
          <Toolbar disableGutters sx={{ display: 'flex', gap: 0 }}>
            <NavText href="/" text="HOME" />
            <NavText href="/advanced_search" text="ADVANCED SEARCH" />
            <NavText href="/friendlist" text="MY FRIENDS" />
            <NavText href="/aboutUs" text="ABOUT US" />
          </Toolbar>
        </Container>
      </AppBar>
      <Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
      </Typography>
    </>
    
  );
}
