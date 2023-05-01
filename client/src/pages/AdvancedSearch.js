import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import {TextField, Box, Slider, Button, Grid, Typography, Checkbox,
     FormGroup, FormControlLabel, Link} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles'; 
import { DataGrid } from '@mui/x-data-grid';


const config = require('../config.json');
export default function App() {
    //inputs for query
    const [searchText, setSearchText] = useState('');
    const [year, setYear] = useState([1887, 2026]);
    const [duration, setDuration] = useState([0, 1320]);
    const [rating, setRating] = useState([0.0, 10.0]);
    const [streamingServices, setStreamingServices] = useState({
        netflix: false,
        hulu: false,
        primeVideo: false,
        disneyPlus: false,
    });
    const [genres, setGenre] = useState({
        genre1: '',
        genre2: '',
        genre3: '',
    });
    //data for query output
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);



    //used within slider components
    function valuetext(value) {
        return `${value}`;
    }
    const Input = styled(MuiInput)`
        width: "52px";
    `;

    //YEAR SLIDER HANDLES
    const handleYearChange = (event, newValue) => {
        setYear(newValue);
    };
    //YEAR BOX INPUTS HANDLES
    const handleYear1Change = (event) => {
        setYear([event.target.value === '' ? '' : Number(event.target.value), year[1]]);
    };
    const handleYear1Blur = () => {
        if (year[0] < 1887) {
            setYear([1887, year[1]]);
        } else if (year[0] > year[1]) {
            setYear([year[1], year[1]]);
        }
    };
    const handleYear2Change = (event) => {
        setYear([year[0], event.target.value === '' ? '' : Number(event.target.value)]);
    };
    const handleYear2Blur = () => {
        if (year[1] < year[0]) {
            setYear([year[0], year[0]]);
        } else if (year[1] > 2026) {
            setYear([year[0], 2026]);
        }
    };

    //DURATION SLIDER HANDLERS
    const handleDurationChange = (event, newValue) => {
        setDuration(newValue);
    };
    //DURATION BOX INPUTS HANDLERS
    const handleDuration1Change = (event) => {
        setDuration([event.target.value === '' ? '' : Number(event.target.value), duration[1]]);
    };
    const handleDuration1Blur = () => {
        if (duration[0] < 0) {
            setDuration([0, duration[1]]);
        } else if (duration[0] > duration[1]) {
            setDuration([duration[1], duration[1]]);
        }
    };
    const handleDuration2Change = (event) => {
        setDuration([duration[0], event.target.value === '' ? '' : Number(event.target.value)]);
    };
    const handleDuration2Blur = () => {
        if (duration[1] < duration[0]) {
            setDuration([duration[0], duration[0]]);
        } else if (year[1] > 1320) {
            setDuration([duration[0], 1320]);
        }
    };

    //RATING SLIDER HANDLER
    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };
    //RATING BOX INPUTS HANDLERS
    const handleRating1Change = (event) => {
        setRating([event.target.value === '' ? '' : Number(event.target.value), rating[1]]);
    };
    const handleRating1Blur = () => {
        if (rating[0] < 0.0) {
            setRating([0.0, rating[1]]);
        } else if (rating[0] > rating[1]) {
            setRating([rating[1], rating[1]]);
        }
    };
    const handleRating2Change = (event) => {
        setRating([rating[0], event.target.value === '' ? '' : Number(event.target.value)]);
    };
    const handleRating2Blur = () => {
        if (rating[1] < rating[0]) {
            setRating([rating[0], rating[0]]);
        } else if (rating[1] > 10.0) {
            setRating([rating[0], 10.0]);
        }
    };


    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/advanced_search`)
          .then(res => res.json())
          .then(resJson => {
            const contentWithId = resJson.map((content) => ({ id: content.titleId, ...content }));
            setData(contentWithId);
          });
      }, []);

    const[netflix, setNetflix] = useState(streamingServices.netflix ? 1 : 0);
    const[hulu, setHulu] = useState(streamingServices.hulu ? 1 : 0);
    const[disney, setDisney] = useState(streamingServices.disneyPlus ? 1 : 0);
    const[prime, setPrime] = useState(streamingServices.primeVideo ? 1 : 0);

    const handleSearch = () => {
        // handle search functionality
        fetch(`http://${config.server_host}:${config.server_port}/advanced_search?title=${searchText}` +
        `&durationMin=${duration[0]}&durationMax=${duration[1]}` +
        `&yearMin=${year[0]}&yearMax=${year[1]}` +
        `&ratingMin=${rating[0]}&ratingMax=${rating[1]}` +
        `&genre1=${genres.genre1}` +
        `&genre2=${genres.genre2}` +
        `&genre3=${genres.genre3}` +
        `&netflix=${netflix}` +
        `&hulu=${hulu}` +
        `&disney=${disney}` +
        `&prime=${prime}`
        )
        .then(res => res.json())
        .then(resJson => {
            // DataGrid expects an array of objects with a unique id.
            // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
            const contentWithId = resJson.map((content) => ({ id: content.titleId, ...content }));
            setData(contentWithId);
        });
    };
    const columns = [
        { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
            <Link component={NavLink} to={`/movies/${params.row.titleId}`} style={{ textDecoration: 'none', color: 'blue' }}>
              {params.row.title}</Link>
        ) },
        { field: 'startYear', headerName: 'Release Year' },
        { field: 'endYear', headerName: 'End Year' },
        { field: 'rating', headerName: 'Rating' },
        { field: 'duration', headerName: 'Duration'},
        { field: 'genres', headerName: 'Genres', width: 200},
        { field: 'Netflix', headerName: 'Netflix' },
        { field: 'Hulu', headerName: 'Hulu' },
        { field: 'PrimeVideo', headerName: 'Prime Video' },
        { field: 'DisneyPlus', headerName: 'Disney+' }
      ]

    return (
        <div style = {{width: '100%', height: '100%', fontFamily: 'sans-serif'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{ marginTop: '50px' }}>Advanced Search</h1>
            {/* <TextField id="filled-basic" label="Search movies and TV shows..." variant="standard" onChange={(e) => setSearchText(e.target.value)}/> */}
            <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search movies and TV shows..."
                style={{ width: '70%', height: '60px', fontSize: '24px' }}
            />
            <div style={{ display: 'flex', width: '80%', justifyContent: 'space-between', alignItems: 'start', marginTop: '50px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2></h2>
                    {/* YEAR SLIDER */}
                    <Box sx={{ width: 300 }}>
                    <Typography id="input-slider" gutterBottom>
                        Year
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs>
                            <Slider
                                min={1887}
                                max={2026}
                                value={year}
                                onChange={handleYearChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                color="secondary"
                                // size ='small'
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={year[0]}
                                size= "small"
                                onChange={handleYear1Change}
                                onBlur={handleYear1Blur}
                                inputProps={{
                                step: 10,
                                min: 1887,
                                max: year[1],
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={year[1]}
                                size="small"
                                onChange={handleYear2Change}
                                onBlur={handleYear2Blur}
                                inputProps={{
                                step: 10,
                                min: year[0],
                                max: 2026,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    </Box>
                    {/*DURATION SLIDER */}
                    <Box sx={{ width: 300 }}>
                    <Typography id="input-slider" gutterBottom>
                        Duration (minutes)
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs>
                            <Slider
                                min={0}
                                max={1320}
                                value={duration}
                                onChange={handleDurationChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                color="secondary"
                                // size ='small'
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={duration[0]}
                                size= "small"
                                onChange={handleDuration1Change}
                                onBlur={handleDuration1Blur}
                                inputProps={{
                                step: 10,
                                min: 0,
                                max: duration[1],
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={duration[1]}
                                size="small"
                                onChange={handleDuration2Change}
                                onBlur={handleDuration2Blur}
                                inputProps={{
                                step: 10,
                                min: duration[0],
                                max: 1320,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    </Box>
                    {/* RATING SLIDER */}
                    <Box sx={{ width: 300 }}>
                    <Typography id="input-slider" gutterBottom>
                        Rating
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs>
                            <Slider
                                min={0.0}
                                max={10.0}
                                value={rating}
                                onChange={handleRatingChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valuetext}
                                color="secondary"
                                // size ='small'
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={rating[0]}
                                size= "small"
                                onChange={handleRating1Change}
                                onBlur={handleRating1Blur}
                                inputProps={{
                                step: 0.5,
                                min: 0.0,
                                max: rating[1],
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={rating[1]}
                                size="small"
                                onChange={handleRating2Change}
                                onBlur={handleRating2Blur}
                                inputProps={{
                                step: 0.5,
                                min: rating[0],
                                max: 10.0,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    </Box>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>Streaming Services</h2>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox onChange={(e) => 
                            {setStreamingServices({...streamingServices, netflix: !streamingServices.netflix})
                            setNetflix(!streamingServices.netflix ? 1 : 0)}}/>} label="Netflix"/>
                        <FormControlLabel control={<Checkbox onChange={(e) => 
                            {setStreamingServices({...streamingServices, hulu: !streamingServices.hulu})
                            setHulu(!streamingServices.hulu ? 1 : 0)}}/>} label="Hulu" />
                        <FormControlLabel control={<Checkbox onChange={(e) =>
                            {setStreamingServices({...streamingServices, primeVideo: !streamingServices.primeVideo})
                            setPrime(!streamingServices.primeVideo ? 1 : 0)}}/>} label="Amazon Prime Video" />
                        <FormControlLabel control={<Checkbox onChange={(e) => 
                            {setStreamingServices({...streamingServices, disneyPlus: !streamingServices.disneyPlus})
                            setDisney(!streamingServices.disneyPlus ? 1 : 0)}}/>} label="Disney+" />
                    </FormGroup>
                </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>Genre</h2>
                    <TextField id="filled-basic" label="Genre 1" variant="filled" onChange={(e) => setGenre({...genres, genre1: e.target.value})}/>
                    <TextField id="filled-basic" label="Genre 2" variant="filled" onChange={(e) => setGenre({...genres, genre2: e.target.value})}/>
                    <TextField id="filled-basic" label="Genre 3" variant="filled" onChange={(e) => setGenre({...genres, genre3: e.target.value})}/>
                </div>
            </div>
            <h2></h2>
            <Button variant="contained" onClick={handleSearch}>SEARCH </Button>
            </div>
            <h2>Results</h2>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
            />
        </div>
    );
}
