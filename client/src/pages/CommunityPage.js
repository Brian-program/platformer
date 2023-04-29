import { useEffect, useState } from 'react';
import { Container } from "@mui/system";
import { Divider, Link, Box, TextField } from '@mui/material';


import UserList from "../components/UserList";
import { useParams } from 'react-router-dom';

const config = require('../config.json');

export default function CommunityPage() {
    const tempId = "iamandal";
    const [friendData, setFriendData] = useState([]);
		const [searchUser, setSearchUser] = useState('');

    useEffect(() => { // fetch the friends list of the user that is logged in
      fetch(`http://${config.server_host}:${config.server_port}/friendlist/${tempId}`)
				.then(res => res.json())
				.then(resJson => setFriendData(resJson));
				// fetch the output of the users from the find friends function
			fetch(`http://${config.server_host}:${config.server_port}/all_users/${searchUser}`)
				.then(res => res.json())
				.then(resJson => {const usersById = resJson.map((user) => ({ id: user.userId, ...user }));
        setSearchUser(usersById);
			});
    }, [searchUser]);

		console.log(friendData);
		console.log(searchUser);

    return (
			<Container>
				<div style={{ display: 'flex' }}>
					<div style={{ flex: 1 }}>
						<div>
							<b>Find Friends</b>
						</div>
						<input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search users..."
            style={{ width: '70%', height: '30px', fontSize: '24px' }}
        		/>
						<button>
							Search
						</button>
						<UserList userData={searchUser} />
					</div>
					<Divider orientation="vertical" flexItem />
					<div style={{ flex: 1 }}>
						<b>My Friends</b>
						<UserList userData={friendData} />
					</div>
				</div>
			</Container>

    );
}
