import React from 'react';
import { Link, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { TableCell, TableContainer, Table, TableBody, TableRow } from '@mui/material';

export default function UserList({ userData }) {
  if (!userData) {
    return <div>Find friends</div>;
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            {userData.map((friend) => (
              <TableRow key={friend.followId}>
                <TableCell>
                  <Link component={NavLink} to={`/watchlist/${friend.followId}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {friend.followId}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
