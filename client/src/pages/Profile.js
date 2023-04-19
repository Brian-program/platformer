import React from 'react';
import { Container } from "@mui/system";
import { Typography } from '@mui/material';


export default function Profile() {

    const {user_id} = useParams();
    const {search_id} = useParams();
    const [watchlistData, setWatchlistData] = useState([{}]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/watchlist/${search_id}`)
          .then(res => res.json())
          .then(resJson => setWatchlistData(resJson));
    }, []);


    return (
        <div>
        <Typography variant="h2" align="center" gutterBottom>
          Profile
        </Typography>

        <MovieGrid moviesData = {watchlistData}/>


      </div>
    );

};
