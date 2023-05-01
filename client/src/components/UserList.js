import React from 'react';
import { Link, Box, List, ListItem, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function UserList({ userData }) {
  // if no matching users, does not display list
  if (!userData || userData === null) {
    return <div>No users found</div>;
  }

  // split the resulting user data into 2
  const halfLength = Math.ceil(userData.length / 2);
  const firstColumnData = userData.slice(0, halfLength);
  const secondColumnData = userData.slice(halfLength);

  // returns a 2 column list within a cell with a scroll bar for search
  return (
    <Box
      style={{
        display: 'flex',
        height: '500px', // Set the desired height of the cell
        overflowY: 'auto', // Enable vertical scrolling
      }}
    >
      <Box style={{ display: 'flex', flex: 1 }}>
        <List style={{ flex: 1, padding: 0 }}>
          {firstColumnData.map((user) => (
            <ListItem key={user.userId} style={{ padding: '4px 0' }}>
              <ListItemButton
                component={NavLink}
                to={`/profile/${user.userId}`}
                style= {{ textAlign: 'center'}}
              >
                <Link>{user.userId}</Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <List style={{ flex: 1, padding: 0 }}>
          {secondColumnData.map((user) => (
            <ListItem key={user.userId} style={{ padding: '4px 0' }}>
              <ListItemButton
                component={NavLink}
                to={`/profile/${user.userId}`}
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                <Link>{user.userId}</Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
