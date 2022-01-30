import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function FounderList(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 100, maxWidth : 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address1</TableCell>
            <TableCell align="right">Shares</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((datum) => (
            <TableRow
              key={datum.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {datum.address}
              </TableCell>
              <TableCell align="right">{datum.shares}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
