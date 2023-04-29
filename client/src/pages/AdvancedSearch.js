import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import * as React from 'react';
import { Container, Divider, Link, Box, Slider, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles'; 


// Range Slider from https://mui.com/material-ui/react-slider/
function valuetext(value) {
    return `${value}`;
}
//range slider takes in name: name of slider, inputSize: size of input boxes, defaultValue: default ranges for slider
//step: increment of input boxes, scale: scale of slider
function RangeSlider({name, inputSize, defaultValue, step, scale}) {
    const Input = styled(MuiInput)`
        width: ${inputSize};
    `;
    const [value, setValue] = React.useState(defaultValue);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInput1Change = (event) => {
        setValue([event.target.value === '' ? '' : Number(event.target.value), value[1]]);
    };

    const handle1Blur = () => {
        if (value[0] < defaultValue[0]) {
        setValue([defaultValue[0], value[1]]);
        } else if (value[0] > value[1]) {
        setValue([value[1], value[1]]);
        }
    };

    const handleInput2Change = (event) => {
        setValue([value[0], event.target.value === '' ? '' : Number(event.target.value)]);
    };

    const handle2Blur = () => {
        if (value[1] < value[0]) {
            setValue([value[0], value[0]]);
        } else if (value[1] > defaultValue[1]) {
            setValue([value[0], defaultValue[1]]);
        }
    };

    return (
        <Box sx={{ width: 300 }}>
        <Typography id="input-slider" gutterBottom>
            {name}
        </Typography>
        <Grid container spacing={3} alignItems="center">
            <Grid item xs>
                <Slider
                    min = {defaultValue[0]}
                    max = {defaultValue[1]}
                    value={value}
                    scale={scale}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    color="secondary"
                    // size ='small'
                />
            </Grid>
            <Grid item>
                <Input
                    value={value[0]}
                    size= "small"
                    onChange={handleInput1Change}
                    onBlur={handle1Blur}
                    inputProps={{
                    step: step,
                    min: defaultValue[0],
                    max: value[1],
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                    }}
                />
            </Grid>
            <Grid item>
                <Input
                    value={value[1]}
                    size="small"
                    onChange={handleInput2Change}
                    onBlur={handle2Blur}
                    inputProps={{
                    step: step,
                    min: value[0],
                    max: defaultValue[1],
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                    }}
                />
            </Grid>
        </Grid>
        </Box>
    );
}

// https://mui.com/material-ui/react-select/
function SelectSortBy() {
    const [sortBy, setSortBy] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setSortBy(event.target.value);
    };
  
    return (
      <div>
        <FormControl variant="filled" sx={{ minWidth: 200}}>
        <InputLabel id="demo-select-small-label">Sort By</InputLabel>
        <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={sortBy}
            label="Sort By"
            onChange={handleChange}
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
    );
  }

const config = require('../config.json');


export default function App() {
  const [searchText, setSearchText] = useState('');
  const [year, setYear] = useState([1888, 2026]);
  const [duration, setDuration] = useState([0, 3600]);
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

  const handleSearch = () => {
    // handle search functionality
  };

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
                <RangeSlider 
                    name="Year" 
                    defaultValue={[1887, 2026]} 
                    inputSize="52px" step="10" 
                    onChange={(e) => setYear(e.target.value)}/>
                {/* DURATION SLIDER */}
                <RangeSlider 
                    name="Duration (minutes)" 
                    defaultValue={[0, 1320]} 
                    inputSize="52px" 
                    step="10" 
                    onChange={(e) => setDuration(e.target.value)}/>
                {/* RATING SLIDER */}
                <RangeSlider 
                    name="Rating" 
                    defaultValue={[0.0, 10.0]} 
                    inputSize="52px" 
                    step="0.5" 
                    scale={(value) => value/1.0} 
                    onChange={(e) => setRating(e.target.value)}/>
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
                <SelectSortBy onChange={(e) => setSortBy(e.target.value)}/>
            </div>
        </div>
        <h2></h2>
        <Button variant="contained" onClick={handleSearch}>SEARCH </Button>
        </div>
    </div>
    );
}
