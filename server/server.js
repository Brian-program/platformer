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
app.get('/movie/:title_id', routes.movie);
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
app.get('/all_users/:userId', routes.all_users);
app.get('/user_login/:userId', routes.user_login);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
