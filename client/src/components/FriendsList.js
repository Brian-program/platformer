import React from 'react';
import { Link, Box, List, ListItem, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function UserList({ userData }) {

  return (
    <Box>
      <List style={{ padding: 0 }}>
        {userData.map((friend) => (
          <ListItem key={friend.followId} style={{ padding: '4px 0' }}>
            <ListItemButton component={NavLink} to={`/profile/${friend.followId}`} style={{ textDecoration: 'none', color: 'blue' }}>
              <Link>{friend.followId}</Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
