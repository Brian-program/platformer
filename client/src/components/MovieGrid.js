import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function MovieGrid({moviesData}) {

  console.log(moviesData);

  return (
    <Grid container spacing={3}>
      {moviesData.map((movie) => (
        <Grid item key={movie.titleId} xs={10} sm={6} md={4} lg={3}>
          <Card>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
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
