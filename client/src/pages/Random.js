import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


const config = require('../config.json');


const Random = () => {
    
    const navigate = useNavigate();
    const [random, setRandom] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/random`)
            .then(res => res.json())
            .then(resJson => setRandom(resJson));
    }, []);
    
    useEffect(() => {
        if (random.titleId) {
            navigate(`/movies/${random.titleId}`);
        }
    }, [random, navigate]);
    

    return (
        <></>
    );
};

export default Random;
