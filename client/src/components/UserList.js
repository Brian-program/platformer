import React from 'react';
import { Link, Box, List, ListItem, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function UserList({ userData }) {
  if (!userData || userData === null) {
    return <div>No users found</div>;
  }

  return (
    <Box>
      <List style={{ padding: 0 }}>
        {userData.map((user) => (
          <ListItem key={user.userId} style={{ padding: '4px 0' }}>
            <ListItemButton component={NavLink} to={`/profile/${user.userId}`} style={{ textDecoration: 'none', color: 'blue' }}>
              <Link>{user.userId}</Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
