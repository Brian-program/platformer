import { useEffect, useState } from 'react';
import { Container } from "@mui/system";
import { Divider, Card, CardContent, Link, TextField, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import theme from '../theme';
import UserList from "../components/UserList";
import FriendsList from "../components/FriendsList";

const config = require('../config.json');

export default function CommunityPage(props) {
    const [userId, setUserId]  = useState(props.user_id); // logged in user
    const [friendData, setFriendData] = useState([]); // user's friends
    const [searchUser, setSearchUser] = useState(''); // user typed in search
    const [searchData, setSearchData] = useState([]); // output of search
    const [allUsers, setAllUsers] = useState([]); // all users

    const handleSearch = (event) => { // calls search user query
        setSearchUser(event.target.value);
    }

	
    useEffect(() => {
		// fetches the friend of the logged in user
        fetch(`http://${config.server_host}:${config.server_port}/friendlist/${userId}`)
            .then(res => res.json())
            .then(resJson => setFriendData(resJson));
		// fetches all users in db
        fetch(`http://${config.server_host}:${config.server_port}/all_users`)
            .then(res => res.json())
            .then(resJson => setAllUsers(resJson));
		// fetches searched users when search is being used
        if (searchUser !== '') {
            fetch(`http://${config.server_host}:${config.server_port}/search_user/${searchUser}`)
                .then(res => res.json())
                .then(resJson => {
                    const usersById = resJson.map((user) => ({ id: user.userId, ...user }));
                    setSearchData(usersById);
                });
        }
    }, [searchUser]); // updates when text field changes

    function isEmptyString(str) { // checks for empty text field
        return str.length === 0;
    }

    function isObjectEmpty(obj) { // checks for matching users
        return Object.keys(obj).length === 0;
    }
	
	function isLoggedIn(userId) { // checks if user is logged in
		return userId !== "";
	}

	// returns a text field for user to type in a user name to find users/friends and a corresponding result output
	// under it, also returns the user's friends list if logged in, otherwise a route to go to login page
    return (
			<>
        <Container>
            <div style={{ display: 'flex' }}>
						<div style={{ flex: 1 }}>
						<Card sx={{ backgroundColor: theme.palette.tertiary.main, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', margin: '0 auto' }}>
								<CardContent style={{ textAlign: 'center' }}>
										<div style={{ textAlign: 'center' }}>
												<h1 style={{fontWeight: 600}}>FIND FRIENDS</h1>
										</div>
										<TextField
												id="outlined-basic" 
												label="Search users" 
												variant="outlined"
												value={searchUser}
												onChange={handleSearch}
												style={{ width: '80%', backgroundColor: 'white', padding: '6px', fontSize: '12px' }}
										/>
									</CardContent>
							</Card>
							<div>
								{isEmptyString(searchUser) ? (
												<UserList userData={allUsers} />
										) : (
												<UserList userData={searchData} />
										)}
							</div>
										
					</div>
							<div style={{ flex: 1 }}>
								<Card sx={{ backgroundColor: theme.palette.secondary.main, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
									<CardContent>
										<div style={{ textAlign: 'center' }}>
										<h2 style={{fontWeight: 500}}>MY FRIENDS</h2>
											<Divider />
										</div>
										{isLoggedIn(userId) ? (
											isObjectEmpty(friendData) ? (
												<div style={{ textAlign: 'center', marginTop: '20px' }}>Search for friends by username</div>
											) : (
												<FriendsList userData={friendData} />
											)
											) : (
												<div style={{ textAlign: 'center', marginTop: '20px' }}>
													<Typography variant="body1">
														<Link component={NavLink} to="/login" style={{ textDecoration: 'underline', color: theme.palette.primary.main, marginRight: '5px' }}>
														Login
														</Link>
														to view your friends.
													</Typography>
												</div>

											)}
									</CardContent>
								</Card>
            </div>
					</div>
        </Container>
				<Typography variant="h2" style={{ textAlign: 'center', marginTop: '50px' }}>
        
				</Typography>
				</>
    );
}
