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
import Logout from './pages/Logout';
import MoviePage  from './pages/MoviePage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import AdvancedSearch from './pages/AdvancedSearch'
import CommunityPage from "./pages/CommunityPage";
import CreateAccount from "./pages/CreateAccount";


// edit pages for tabs in component header -- home, community, find, search, profile/login
export default function App() {

  const [user_id, setUser_id] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar user_id={user_id} setUserId={setUser_id} />
        <Routes> 
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login user_id={user_id} setUser_id={setUser_id}/>} />
          <Route path="/logout" element={<Logout user_id={user_id} setUser_id={setUser_id}/>} />
          <Route path="/create_account" element={<CreateAccount user_id={user_id} setUser_id={setUser_id}/>} />
          <Route path="/movies/:movieId" element={<MoviePage />} />
          <Route path="/profile" element={<Profile user_id={user_id} setUser_id={setUser_id}/>} />
          <Route path="/profile/:searchId" element={<Profile user_id={user_id}/>} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/advanced_search/" element={<AdvancedSearch/>} />
          <Route path="/friendlist" element={<CommunityPage user_id={user_id}/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}