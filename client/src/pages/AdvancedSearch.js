import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import * as React from 'react';
import {TextField, Box, Slider, Button, Grid, Typography, Checkbox, FormGroup, FormControlLabel, Link} from '@mui/material';
import MuiInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
    const [sortBy, setSortBy] = useState('');
    //data for query output
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [selectedTitleId, setSelectedTitleId] = useState(null);



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

    //SELECT BOX HANDLER
    const handleSelectChange = (event) => {
        setSortBy(event.target.value);
    };

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/advanced_search`)
          .then(res => res.json())
          .then(resJson => {
            const contentWithId = resJson.map((content) => ({ id: content.titleId, ...content }));
            setData(contentWithId);
          });
      }, []);

    const handleSearch = () => {
        // handle search functionality
        console.log('INPUTS')
        console.log('Seach input: ', searchText);
        console.log('Start Year: ', year[0]);
        console.log('End Year: ', year[1]);
        console.log('Min Duration: ', duration[0]);
        console.log('Max Duration: ', duration[1]);
        console.log('Min Rating: ', rating[0]);
        console.log('Max Rating: ', rating[1]);
        console.log('Netflix: ', streamingServices.netflix);
        console.log('Hulu: ', streamingServices.hulu);
        console.log('Prime: ', streamingServices.primeVideo);
        console.log('Disney: ', streamingServices.disneyPlus);
        console.log('Genre 1: ', genres.genre1);
        console.log('Genre 2: ', genres.genre2);
        console.log('Genre 3: ', genres.genre3);
        console.log('Sort by: ', sortBy);

        fetch(`http://${config.server_host}:${config.server_port}/advanced_search?title=${searchText}` +
        `&duration_min=${duration[0]}&duration_max=${duration[1]}` +
        `&year_min=${year[0]}&year_max=${year[1]}` +
        `&rating_min=${rating[0]}&rating_max=${rating[1]}` +
        `&genre1=${genres.genre1}` +
        `&genre2=${genres.genre2}` +
        `&genre3=${genres.genre3}` +
        `&netflix=${streamingServices.netflix ? 1 : 0}` +
        `&hulu=${streamingServices.hulu ? 1 : 0}` +
        `&disney=${streamingServices.disneyPlus ? 1 : 0}` +
        `&prime=${streamingServices.primeVideo ? 1 : 0}`
        )
        .then(res => res.json())
        .then(resJson => {
            // DataGrid expects an array of objects with a unique id.
            // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
            const contentWithId = resJson.map((content) => ({ id: content.titleId, ...content }));
            setData(contentWithId);
        });
        console.log('Query output: ', data);
    };
    const columns = [
        { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
            <Link onClick={() => setSelectedTitleId(params.row.titleId)}>{params.value}</Link>
        ) },
        { field: 'duration', headerName: 'Duration' },
        { field: 'plays', headerName: 'Plays' },
        { field: 'danceability', headerName: 'Danceability' },
        { field: 'energy', headerName: 'Energy' },
        { field: 'valence', headerName: 'Valence' },
        { field: 'tempo', headerName: 'Tempo' },
        { field: 'key_mode', headerName: 'Key' },
        { field: 'explicit', headerName: 'Explicit' },
      ]

    return (
        <div style = {{width: '100%', height: '100%', fontFamily: 'sans-serif'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{ marginTop: '50px' }}>Advanced Search</h1>
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
                        Duration
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
                        Duration
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
                        <FormControlLabel control={<Checkbox onChange={(e) => setStreamingServices({...streamingServices, netflix: !streamingServices.netflix})}/>} label="Netflix"/>
                        <FormControlLabel control={<Checkbox onChange={(e) => setStreamingServices({...streamingServices, hulu: !streamingServices.hulu})}/>} label="Hulu" />
                        <FormControlLabel control={<Checkbox onChange={(e) => setStreamingServices({...streamingServices, primeVideo: !streamingServices.primeVideo})}/>} label="Amazon Prime Video" />
                        <FormControlLabel control={<Checkbox onChange={(e) => setStreamingServices({...streamingServices, disneyPlus: !streamingServices.disneyPlus})}/>} label="Disney+" />
                    </FormGroup>
                </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>Genre</h2>
                    <TextField id="filled-basic" label="Genre 1" variant="filled" onChange={(e) => setGenre({...genres, genre1: e.target.value})}/>
                    <TextField id="filled-basic" label="Genre 2" variant="filled" onChange={(e) => setGenre({...genres, genre2: e.target.value})}/>
                    <TextField id="filled-basic" label="Genre 3" variant="filled" onChange={(e) => setGenre({...genres, genre3: e.target.value})}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>Sort By</h2>
                    <div>
                        <FormControl variant="filled" sx={{ minWidth: 200}}>
                        <InputLabel id="demo-select-small-label">Sort By</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={sortBy}
                            label="Sort By"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            <MenuItem value={"Alphabetical"}>Alphabetical</MenuItem>
                            <MenuItem value={"Rating"}>Rating</MenuItem>
                            <MenuItem value={"Year Released"}>Year Released</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <h2></h2>
            <Button variant="contained" onClick={handleSearch}>SEARCH </Button>
            </div>
        </div>
    );
}
