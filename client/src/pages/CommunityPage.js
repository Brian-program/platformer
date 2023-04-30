import { useEffect, useState } from 'react';
import { Container } from "@mui/system";
import { Divider, Card, CardContent, TextField, Typography } from '@mui/material';
import theme from '../theme';


import UserList from "../components/UserList";
import FriendsList from "../components/FriendsList";

const config = require('../config.json');

export default function CommunityPage(props) {
    const [userId, setUserId]  = useState(props.user_id);
    // const userId = "iamandal";
    console.log(props.user_id);
    const [friendData, setFriendData] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const handleSearch = (event) => {
        setSearchUser(event.target.value);
    }

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/friendlist/${userId}`)
            .then(res => res.json())
            .then(resJson => setFriendData(resJson));

        fetch(`http://${config.server_host}:${config.server_port}/all_users`)
            .then(res => res.json())
            .then(resJson => setAllUsers(resJson));

        if (searchUser !== '') {
            fetch(`http://${config.server_host}:${config.server_port}/search_user/${searchUser}`)
                .then(res => res.json())
                .then(resJson => {
                    const usersById = resJson.map((user) => ({ id: user.userId, ...user }));
                    setSearchData(usersById);
                });
        }
    }, [searchUser]);

    function isEmptyString(str) {
        return str.length === 0;
    }

    function isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

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
										{isObjectEmpty(friendData) ? (
											<div>Search for friends by users</div>
										) : (
											<FriendsList userData={friendData} />
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
