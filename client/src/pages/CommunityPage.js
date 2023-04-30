import { useEffect, useState } from 'react';
import { Container } from "@mui/system";
import { Divider, Link, Box, TextField, OutlinedInput } from '@mui/material';

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
        <Container>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <div>
                        <b>Find Friends</b>
                    </div>
                    <TextField
                        type="text"
                        value={searchUser}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        variant="outlined"
                        style={{ width: '70%' }}
                    />
                    {isEmptyString(searchUser) ? (
                        <UserList userData={allUsers} />
                    ) : (
                        <UserList userData={searchData} />
                    )}
                </div>
                <Divider orientation="vertical" flexItem />
                <div style={{ flex: 1 }}>
                    <b>My Friends</b>
                    {isObjectEmpty(friendData) ? (
											<div>Search for friends by users</div>
                    ) : (
											<FriendsList userData={friendData} />
                    )}
                </div>
            </div>
        </Container>
    );
}
