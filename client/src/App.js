import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { cyan, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import theme from './theme';

import React, { useState } from 'react';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import MoviePage  from './pages/MoviePage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import AdvancedSearch from './pages/AdvancedSearch'
import CommunityPage from "./pages/CommunityPage";


// edit pages for tabs in component header -- home, community, find, search, profile/login
export default function App() {

  const [user_id, setUser_id] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes> 
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login user_id={user_id} setUser_id={setUser_id}/>} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/profile" element={<Profile user_id={user_id}/>} />
          <Route path="/profile/:searchId" element={<Profile user_id={user_id}/>} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/advanced_search/" element={<AdvancedSearch/>} />
          <Route path="/friendlist" element={<CommunityPage user_id={user_id}/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}