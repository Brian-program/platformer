import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const Logout = ({ user_id, setUser_id }) => {
    
    const navigate = useNavigate();

    // logs user out and navigates to login
    useEffect(() => {
        setUser_id("");
        navigate('/login');
    }, [user_id, setUser_id]);
    

    return (
        <></>
    );
};

export default Logout;