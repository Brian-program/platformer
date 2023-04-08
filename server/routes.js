const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// HOLD FOR NOW???
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

// GET /movie/:title_id
const movie = async function(req, res) {

  //returns all info about imdb movie including streaming service if it exists
  const titleId = req.params.titleId;
  connection.query(`
    SELECT *
    FROM (SELECT * FROM imdb WHERE titleId = '${titleId}') selected_movie 
    LEFT JOIN kaggle 
    ON selected_movie.title = kaggle.title
    WHERE titleId = '${titleId}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// GET /profile/:userId (aka followingList)
const profile = async function(req, res) {
  const userId = req.params.userId;
  connection.query(`
    SELECT userId, followId
    FROM followings
    WHERE userId = '${userId}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// GET /watchlist/:userId
const watchlist = async function(req, res) {
  const userId = req.params.userId;
  connection.query(`
    SELECT *
    FROM watchlist
    WHERE userId = '${userId}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// GET /top_movies
const top_movies = async function(req, res) {
  connection.query(`
    SELECT titleId, title, image
    FROM imdb
    ORDER BY rating DESC
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// GET /simple_search
const simple_search = async function(req, res) {
  const title = req.params.title;
  connection.query(`
    SELECT titleId, title, image
    FROM imdb
    WHERE title LIKE '${title}'
    LIMIT 5
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs GETT RID OFFOFOFOFO
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 25;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
      SELECT S.song_id, S.title, S.plays, A.title AS album, A.album_id
      FROM Songs S
      JOIN Albums A
      ON A.album_id = S.album_id
      ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    connection.query(`
      SELECT S.song_id, S.title, S.plays, A.title AS album, A.album_id
      FROM Songs S
      JOIN Albums A
      ON A.album_id = S.album_id
      ORDER BY S.plays DESC
      LIMIT ${(page-1)*pageSize}, ${pageSize}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
  }
}

// Route 8: GET /top_albums GETTT RIIIID OFOOFOFOFO
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
      WITH sum_plays AS (
        SELECT A.album_id AS album_id, SUM(S.plays) AS plays
        FROM Songs S
        JOIN Albums A
        ON A.album_id = S.album_id
        GROUP BY A.album_id
      )
      SELECT A.title, S.plays, A.album_id
      FROM sum_plays S
      JOIN Albums A
      ON A.album_id = S.album_id
      ORDER BY S.plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    connection.query(`
    WITH sum_plays AS (
      SELECT A.album_id AS album_id, SUM(S.plays) AS plays
      FROM Songs S
      JOIN Albums A
      ON A.album_id = S.album_id
      GROUP BY A.album_id
    )
    SELECT A.title, S.plays, A.album_id
    FROM sum_plays S
    JOIN Albums A
    ON A.album_id = S.album_id
    ORDER BY S.plays DESC
    LIMIT ${(page-1)*pageSize}, ${pageSize}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
  }
}


// Route 9: GET /search_albums
const advanced_search = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationMin = req.query.durationMin ?? 1;
  const durationMax = req.query.durationMax ?? 1320;
  const yearMin = req.query.yearMin ?? 1888;
  const yearMax = req.query.yearMax ?? 2026;
  const ratingMin = req.query.ratingMin ?? 0;
  const ratingMax = req.query.ratingMax ?? 10;
  const genre1 = req.query.plays_low ?? '';
  const genre2 = req.query.plays_low ?? '';
  const genre3 = req.query.plays_low ?? '';
  const netflix = req.query.plays_high ?? 0;
  const hulu = req.query.plays_high ?? 0;
  const disney = req.query.plays_high ?? 0;
  const prime = req.query.plays_high ?? 0;

  connection.query(`
  SELECT *
  FROM imdb LEFT JOIN kaggle ON imdb.title = kaggle.title
  WHERE title LIKE '%${title}%' AND
  ratings >= ${ratingMin} AND ratings <= ${ratingMax} AND
  startYear >= ${yearMin} AND start <= ${yearMax} AND
  duration >= ${durationMin} AND duration <= ${durationMax} AND
  (genres LIKE '%${genre1}%' OR genres LIKE '%${genre2}%' OR genres LIKE '%${genre3}%')
  AND (
    (Netflix = ${netflix} AND Netflix = 1)  OR 
    (Hulu = ${hulu} AND Hulu = 1) OR 
    (PrimeVideo = ${prime} AND PrimeVideo = 1) OR 
    (DisneyPlus = ${disney} AND DisneyPlus = 1)
    )
  ORDER BY title LIKE '%${title}%'
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
  } else {
    res.json(data);
  }
});
}


module.exports = {
  // author,
  // random,
  // song,
  // album,
  // albums,
  // album_songs,
  // top_songs,
  // top_albums,
  // search_songs,
  movie,
  watchlist,
  profile,
  top_movies,
  simple_search,
  // following_top_movies, do this in the future
  advanced_search
}
