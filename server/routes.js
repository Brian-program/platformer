const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// GET random movie/tv show
// returns a generated random titleId that exists in the akas table
const random = async function(req, res) {
  connection.query(`
    SELECT titleId
    FROM akas
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// GET /movie/:title_id
// given titleId, returns all info with that titleId

const movies = async function(req, res) {
  const titleId = req.params.titleId;
  connection.query(`
  SELECT titleId, selected_movie.title as title, rating, startYear, endYear, duration, genre, Netflix, Hulu, PrimeVideo, DisneyPlus
  FROM (SELECT *
        FROM (SELECT akas.titleId,
            akas.title,
            ratings.averageRating AS rating,
            basics.startYear,
            basics.endYear,
            basics.runtimeMinutes AS duration,
            basics.genres AS genre
            FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst
                 LEFT JOIN basics ON akas.titleId = basics.tconst) imdb
        WHERE titleId = '${titleId}') selected_movie
         LEFT JOIN kaggle ON selected_movie.title = kaggle.title
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


// GET /friendlist/:userId (aka followingList)
// given an input userId, this will return all followIds from the following table 

const friendlist = async function(req, res) {
  const userId = req.params.userId;
  connection.query(`
    SELECT DISTINCT userId, followId
    FROM followings
    WHERE userId = '${userId}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

//given two inputs, userId and followId, this will return the followId if it exists 

const getFriend = async function(req, res) {
  const userId = req.params.userId;
  const followId = req.params.followId;
  connection.query(`
    SELECT followId
    FROM followings
    WHERE userId = '${userId}' AND followId = '${followId}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /watchlist/:userId
//given the input userId, this will return userId, the titleId, and the title after optimizing userId and joining on the table akas

const watchlist = async function(req, res) {
  const userId = req.params.userId;
  connection.query(`
    SELECT DISTINCT userId, akas.titleId, akas.title
    FROM (SELECT * FROM watchlist WHERE userId = '${userId}') list
    JOIN akas ON list.titleId = akas.titleId
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// return the top ten distinct titleId and title for all movies/TV shows from the database
// GET /top_movies

const top_movies = async function(req, res) {
  connection.query(`
    SELECT titleId, title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre,
      ratings.numVotes as numVotes
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
    ORDER BY (rating * numVotes) DESC
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

// GET /top_netflix
// return the top ten rated titleId and title for all movies on Netflix

const top_netflix = async function(req, res) {
  connection.query(`
  SELECT titleId, imdb.title
  FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre,
      ratings.numVotes as numVotes
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb LEFT JOIN kaggle ON imdb.title = kaggle.title
  WHERE Netflix = 1
  ORDER BY (rating * numVotes) DESC
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

// GET /top_hulu
// return the top ten rated titleId and title for all movies on Hulu.

const top_hulu = async function(req, res) {
  connection.query(`
  SELECT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre,
      ratings.numVotes as numVotes
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb 
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE Hulu = 1
    ORDER BY (rating * numVotes) DESC
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

// GET /top_DisneyPlus
// return the top ten rated titleId and title for all movies on Disney+.

const top_DisneyPlus = async function(req, res) {
  connection.query(`
  SELECT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre,
      ratings.numVotes as numVotes
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE DisneyPlus = 1
    ORDER BY (rating * numVotes) DESC
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

// GET /top_PrimeVideo
// return the top ten rated  titleId and title for all movies on Prime.

const top_PrimeVideo = async function(req, res) {
  connection.query(`
    SELECT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre,
      ratings.numVotes as numVotes
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE PrimeVideo = 1
    ORDER BY (rating * numVotes) DESC
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

// GET /simple_search/:title
// return top 5 queries given an input, this was never used though

const simple_search = async function(req, res) {
  const title = req.params.title;
  connection.query(`
    SELECT  titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
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

// GET /advanced_search
// given inputs (year, up to 3 genres, duration, rating, platforms, title) that will be filtered by, this will return all information based on the input conditions (inputs will be done via queries)

const advanced_search = async function(req, res) {
  const title = req.query.title ?? '';
  const durationMin = req.query.durationMin ?? 1;
  const durationMax = req.query.durationMax ?? 1320;
  const yearMin = req.query.yearMin ?? 1888;
  const yearMax = req.query.yearMax ?? 2026;
  const ratingMin = req.query.ratingMin ?? 0;
  const ratingMax = req.query.ratingMax ?? 10;
  const genre1 = req.query.genre1 ?? '';
  const genre2 = req.query.genre2 ?? '';
  const genre3 = req.query.genre3 ?? '';
  const netflix = req.query.netflix ?? 0;
  const hulu = req.query.hulu ?? 0;
  const disney = req.query.disney ?? 0;
  const prime = req.query.prime ?? 0;

  if (netflix == 0 && hulu == 0 && disney == 0 && prime == 0) {
    connection.query(`
      SELECT titleId, imdb.title AS title, rating, startYear, endYear, duration, genres, Netflix, Hulu, PrimeVideo, DisneyPlus
      FROM (SELECT akas.titleId,
          akas.title,
          ratings.averageRating AS rating,
          basics.startYear,
          basics.endYear,
          basics.runtimeMinutes AS duration,
          basics.genres AS genres
          FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst
      ) imdb LEFT JOIN kaggle ON imdb.title = kaggle.title
      WHERE imdb.title LIKE '%${title}%' AND
        rating >= ${ratingMin} AND rating <= ${ratingMax} AND
        startYear >= ${yearMin} AND startYear <= ${yearMax} AND
        duration >= ${durationMin} AND duration <= ${durationMax} AND
        (genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%')
      ORDER BY Netflix DESC, Hulu DESC, PrimeVideo DESC, DisneyPlus DESC, imdb.rating DESC
    `, (err, data) => {
        if (err || data.length === 0) {
        console.log(err);
        res.json([]);
        } else {
        res.json(data);
        }
    });
  } else {
      connection.query(`
      SELECT titleId, imdb.title AS title, rating, startYear, endYear, duration, genres, Netflix, Hulu, PrimeVideo, DisneyPlus
      FROM (SELECT akas.titleId,
          akas.title,
          ratings.averageRating AS rating,
          basics.startYear,
          basics.endYear,
          basics.runtimeMinutes AS duration,
          basics.genres AS genres
          FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN basics ON akas.titleId = basics.tconst
      ) imdb LEFT JOIN kaggle ON imdb.title = kaggle.title
      WHERE imdb.title LIKE '%${title}%' AND
        rating >= ${ratingMin} AND rating <= ${ratingMax} AND
        startYear >= ${yearMin} AND startYear <= ${yearMax} AND
        duration >= ${durationMin} AND duration <= ${durationMax} AND
        (genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%')
        AND (
          (Netflix = ${netflix} AND Netflix = 1)  OR 
          (Hulu = ${hulu} AND Hulu = 1) OR 
          (PrimeVideo = ${prime} AND PrimeVideo = 1) OR 
          (DisneyPlus = ${disney} AND DisneyPlus = 1)
        )
      ORDER BY imdb.rating DESC
  `, (err, data) => {
      if (err || data.length === 0) {
      console.log(err);
      res.json([]);
      } else {
      res.json(data);
      }
    });
  }
}

// GET /all_users
// returns all userIds from the table users

const all_users = async function(req, res) {
  //returns a list of userIds from searching for a specific username
  connection.query(`
    SELECT userId
    FROM users
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /search_user/:userId
// returns a list of userIds from searching for a specific username (searching for users)

const search_user = async function(req, res) {
  const userId = req.params.userId;
  connection.query(`
    SELECT userId
    FROM users
    WHERE users.userId LIKE '%${userId}%'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /user_login/:userId
// given a username, returns a password if the userId exists.

const user_login = async function(req, res) {
  const username = req.params.username;
  connection.query(`
    SELECT password
    FROM users
    WHERE userId = "${username}"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// POST add to friendlist
// A POST method that takes in a parsed json and inserts the userId and followId into the followings table (friendlist)
const add_friendlist = async function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { userId, followId } = JSON.parse(body);
    connection.query(`
      INSERT INTO followings (userId, followId)
      VALUES ('${userId}', '${followId}')
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  });
}

// POST add to users
// A POST method that takes in a parsed json and inserts the userId and password into the users table (add friend to friendlist)

const add_user = async function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { userId, password } = JSON.parse(body);
    connection.query(`
      INSERT INTO users (userId, password)
      VALUES ('${userId}', '${password}')
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  });
}

// DELETE user from friendslist
// A DELETE method that takes in a parsed json and deletes the userId and followId from the followings table  (remove friend from friendlist).

const remove_friendlist = async function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { userId, followId } = JSON.parse(body);
    connection.query(`
      DELETE FROM followings
      WHERE userId = '${userId}' AND followId = '${followId}'
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  });
}

// POST add movie to one's watchlist
// A POST method that takes in a parsed json and inserts the userId and titleId into the watchlist table (add movie to watchlist)

const add_watchlist = async function(req, res) {
  console.log("add watchlist");
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { userId, titleId } = JSON.parse(body);
    console.log(JSON.parse(body));
    connection.query(`
      INSERT INTO watchlist (userId, titleId)
      VALUES ('${userId}', '${titleId}')
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  });
}

// DELETE remove movie from one's watchlist
// A DELETE method that takes in a parsed json and deletes the userId and titleId from the watchlist table (remove movie from watchlist)

const remove_watchlist = async function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const { userId, titleId } = JSON.parse(body);
    connection.query(`
      DELETE FROM watchlist
      WHERE userId = '${userId}' AND titleId = '${titleId}'
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    });
  });
}

module.exports = {
  random,
  movies,
  watchlist,
  getFriend,
  friendlist,
  top_movies,
  simple_search,
  top_DisneyPlus,
  top_PrimeVideo,
  top_netflix,
  top_hulu,
  advanced_search,
  all_users,
  search_user,
  user_login,
  add_friendlist,
  add_watchlist,
  remove_watchlist,
  add_user,
  remove_friendlist,
}
