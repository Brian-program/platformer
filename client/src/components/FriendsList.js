import React from 'react';
import { Link, Box, List, ListItem, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function UserList({ userData }) {
  // given a list of users, format users for desired friendslist
  // returns a list of friends based on input
  return (
    <Box style={{
      display: 'flex',
      height: '550px',
      overflowY: 'auto',
    }}>
      <List style={{ flex: 1, padding: 0 }}>
        {userData.map((friend) => (
          <ListItem key={friend.followId} style={{ padding: '4px 0' }}>
            <ListItemButton component={NavLink} to={`/profile/${friend.followId}`}>
              <Link>{friend.followId}</Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    
  );
}
