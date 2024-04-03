import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CA, TableCA } from '@/type/ca';
import { Button, Pagination, TablePagination, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState,useEffect } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "#FFEEFF",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function CATable({cas,handleSearchQoute,handleChangeTable,count}:{cas:CA[],handleSearchQoute:(ca:string)=>void,handleChangeTable:(page:number,rowsPerPage:number)=>void,count:number}) {
    const [page,setPage] = useState(0)
    const [rowsPerPage,setRowsPerPage] = useState(10)

    useEffect(()=>{handleChangeTable(page,rowsPerPage)},[page,rowsPerPage])
  return (
    <TableContainer className='mt-3'>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell >หมายเลขผู้ใช้ไฟ</StyledTableCell>
            <StyledTableCell >ชื่อ</StyledTableCell>
            <StyledTableCell >ที่อยู่</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cas.map((row) => (
            <StyledTableRow key={row.ca}>
            <StyledTableCell sx={{width:30}} align="right"><Button onClick={()=>handleSearchQoute(row.ca)}><SearchIcon /></Button></StyledTableCell>
              <StyledTableCell >{row.ca}</StyledTableCell>
              <StyledTableCell >{row.name}</StyledTableCell>
              <StyledTableCell >{row.address}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {cas.length == 0 && (<Typography>ไม่มีข้อมูล</Typography>)}
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(e,v)=>setPage(v)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e)=>setRowsPerPage(Number(e.target.value))}
        />
    </TableContainer>
  );
}