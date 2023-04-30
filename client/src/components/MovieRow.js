import React, { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const API_KEY = 'd2e25fe6';

const MovieRow = ({ movies }) => {
  const [posterUrls, setPosterUrls] = useState([]);

  useEffect(() => {
    async function fetchPosterUrls() {
      const urls = await Promise.all(movies.slice(0, 10).map(async (movie) => {
        const response = await fetch(`http://www.omdbapi.com/?i=${movie.titleId}&apikey=${API_KEY}`);
        const data = await response.json();
        return data.Poster;
      }));
      setPosterUrls(urls);
    }
    fetchPosterUrls();
  }, [movies]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {movies.slice(0, 10).map((movie, index) => (
        <div key={movie.id} style={{ width: '10%', padding: '5px' }}>
          <img
            src={posterUrls[index]}
            style={{ width: '100%', height: 'auto' }}
          />
          <div style={{ textAlign: 'center', marginTop: '5px' }}>
            <Link component={NavLink} to={`/movies/${movie.titleId}`} style={{ textDecoration: 'none', color: 'blue' }}>
              {movie.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieRow;
