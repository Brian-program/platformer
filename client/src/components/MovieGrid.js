import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';


export default function MovieGrid(moviesInput) {
  const moviesData = moviesInput

  return (
    <Grid container spacing={3}>
      {moviesData.map((movie) => (
        <Grid item key={movie.title} xs={10} sm={6} md={4} lg={3}>
          <Card>
            <CardMedia
              component="img"
              image={movie.poster}
              // alt={movie.title}
            />

            <CardContent>
              <Typography variant="h6" component="h2">
                {movie.title}
              </Typography>
            </CardContent>

          </Card>
        </Grid>
      ))}
    </Grid>
  );

}
