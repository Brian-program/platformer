import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_KEY = 'd2e25fe6';

export default function MovieGrid({moviesData, movieId}) {

  const [posterUrls, setPosterUrls] = useState({});
  
  useEffect(() => {
    async function fetchData() {
      const urls = await Promise.all(moviesData.map(async (movie) => {
        const response = await fetch(`http://www.omdbapi.com/?i=${movie.titleId}&apikey=${API_KEY}`);
        const data = await response.json();
        return data.Poster;
      }));
      const newPosterUrls = {};
      for (let i = 0; i < moviesData.length; i++) {
        newPosterUrls[moviesData[i].titleId] = urls[i];
      }
      setPosterUrls(newPosterUrls);
    }
    fetchData();
  }, [moviesData]);

  return (
    <Grid container spacing={3}>
      {moviesData.map((movie) => (
        <Grid item key={movie.titleId} xs={10} sm={6} md={4} lg={3}>
          <Card>
            <CardMedia
              component="img"
              image={posterUrls[movie.titleId]}
              style={{ width: '100%', height: 'auto' }}
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                <Link component={NavLink} to={`/movies/${movie.titleId}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {movie.title}
                </Link>
              </Typography>
            </CardContent>

          </Card>
        </Grid>
      ))}
    </Grid>
  );

}
