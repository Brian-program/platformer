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
const movies = async function(req, res) {

  //returns all info about imdb movie including streaming service if it exists
  const titleId = req.params.titleId;
  connection.query(`
  SELECT *
      FROM (SELECT * FROM 
          (SELECT akas.titleId, 
          akas.title, 
          ratings.averageRating AS rating,
          crew.directors, 
          basics.startYear, 
          basics.endYear, 
          basics.runtimeMinutes AS duration, 
          basics.genres AS genre
          FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
          ) imdb
        WHERE titleId = '${titleId}'
        ) selected_movie 
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


// GET /friendlist/:userId (aka followingList)
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

const getUserMovie = async function(req, res) {
  const userId = req.params.userId;
  const titleId = req.params.titleId;
  connection.query(`
    SELECT titleId
    FROM watchlist
    WHERE userId = '${userId}' AND titleId = '${titleId}'
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

//add image back into the query
// GET /top_movies
const top_movies = async function(req, res) {
  connection.query(`
    SELECT DISTINCT titleId, title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
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

// GET /top_netflix
const top_netflix = async function(req, res) {
  connection.query(`
  SELECT DISTINCT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE Netflix = 1
    ORDER BY RottenTomatoes DESC
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
      //console.log("hajkdkhkjio");
    }
  });
}

// GET /top_hulu
const top_hulu = async function(req, res) {
  connection.query(`
  SELECT DISTINCT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb 
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE Hulu = 1
    ORDER BY RottenTomatoes DESC
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
const top_DisneyPlus = async function(req, res) {
  connection.query(`
  SELECT DISTINCT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE DisneyPlus = 1
    ORDER BY RottenTomatoes DESC
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
const top_PrimeVideo = async function(req, res) {
  connection.query(`
    SELECT DISTINCT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
      ) imdb
    LEFT JOIN kaggle ON imdb.title = kaggle.title
    WHERE PrimeVideo = 1
    ORDER BY RottenTomatoes DESC
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
const simple_search = async function(req, res) {
  const title = req.params.title;
  connection.query(`
    SELECT DISTINCT titleId, imdb.title
    FROM (SELECT akas.titleId, 
      akas.title, 
      ratings.averageRating AS rating,
      crew.directors, 
      basics.startYear, 
      basics.endYear, 
      basics.runtimeMinutes AS duration, 
      basics.genres AS genre
      FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
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


//GET /advanced_search
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
        SELECT *
        FROM (SELECT akas.titleId, 
          akas.title, 
          ratings.averageRating AS rating,
          crew.directors, 
          basics.startYear, 
          basics.endYear, 
          basics.runtimeMinutes AS duration, 
          basics.genres AS genres
        FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
        ) imdb
        LEFT JOIN kaggle ON imdb.title = kaggle.title
        WHERE imdb.title LIKE '${title}%' AND
        rating >= ${ratingMin} AND rating <= ${ratingMax} AND
        startYear >= ${yearMin} AND startYear <= ${yearMax} AND
        duration >= ${durationMin} AND duration <= ${durationMax} AND
        (genres LIKE '%${genre1}%' AND genres LIKE '%${genre2}%' AND genres LIKE '%${genre3}%')
        ORDER BY imdb.rating DESC
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
        SELECT *
        FROM (SELECT akas.titleId, 
          akas.title, 
          ratings.averageRating AS rating,
          crew.directors, 
          basics.startYear, 
          basics.endYear, 
          basics.runtimeMinutes AS duration, 
          basics.genres AS genres
        FROM akas LEFT JOIN ratings ON akas.titleId = ratings.tconst LEFT JOIN crew ON akas.titleId = crew.tconst LEFT JOIN basics ON akas.titleId = basics.tconst      
        ) imdb
        LEFT JOIN kaggle ON imdb.title = kaggle.title
        WHERE imdb.title LIKE '${title}%' AND
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
const search_user = async function(req, res) {

  //returns a list of userIds from searching for a specific username
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
const user_login = async function(req, res) {

  //returns a password for a specific userId
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

// POST
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


//DELETE
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


// POST
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

//DELETE
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
  // random,
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
  getUserMovie,

  add_friendlist,
  add_watchlist,
  remove_watchlist,

  remove_friendlist,
}
