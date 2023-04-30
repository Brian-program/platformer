const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/movies/:titleId', routes.movies);
// app.get('/random', routes.random);
app.get('/friendlist/:userId', routes.friendlist);
app.get('/watchlist/:userId', routes.watchlist);
app.get('/top_movies', routes.top_movies);
app.get('/simple_search', routes.simple_search);
app.get('/advanced_search', routes.advanced_search);

app.get('/top_DisneyPlus', routes.top_DisneyPlus);
app.get('/top_PrimeVideo', routes.top_PrimeVideo);
app.get('/top_netflix', routes.top_netflix);
app.get('/top_hulu', routes.top_hulu);
app.get('/search_user/:userId', routes.search_user);
app.get('/all_users', routes.all_users);
app.get('/user_login/:username', routes.user_login);
app.get('/getFriend/:userId/:followId', routes.getFriend);
app.get('getUserMovie/:userId/:titleId', routes.getUserMovie);

//post methods
app.post('/add_friendlist', routes.add_friendlist);
app.post('/add_watchlist', routes.add_watchlist);

//delete methods
app.delete('/remove_friendlist', routes.remove_friendlist);
app.delete('/remove_watchlist', routes.remove_watchlist);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
