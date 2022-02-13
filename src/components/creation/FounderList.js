import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



//ABOUT - for use in the treausry creation screen. displays proposed treasury founders nicely.





export default function FounderList(props) {
  let tableData;
  if (props.data.length == 0) {
    tableData = [{address:'0x...',shares:'Nil'},{address:'0x...',shares:'Nil'},{address:'0x...',shares:'Nil'}];
  } else {
    tableData = props.data;
  }

  return (
    <Box sx = {{
      border : '2px solid',
      borderColor : '#2196f3',
      borderRadius : '5px',
      textAlign : 'centre',
      mx:2,
      my:2
    }}>
    <Typography
    variant="h6"
    gutterBottom
    component="div"
    sx = {{mx:2,mt:2}}>
     Proposed summoners and shares
   </Typography>
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 100, maxWidth : 500, mx:2, my:2}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Address1</TableCell>
            <TableCell align="right">Shares</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((datum) => (
            <TableRow
              key={tableData.indexOf(datum)}
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
    </Box>
  );
}
