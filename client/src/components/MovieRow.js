import React from 'react';

const MovieRow = ({ movies }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {/* {movies.map((movie) => (
        <div key={movie.id} style={{ width: '10%', padding: '5px' }}>
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            style={{ width: '100%', height: 'auto' }}
          />
          <p style={{ textAlign: 'center', marginTop: '5px' }}>{movie.title}</p>
        </div>
      ))} */}
    </div>
  );
};

export default MovieRow;
