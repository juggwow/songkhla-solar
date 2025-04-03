import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CA, CAWithQouteCount, TableCA } from "@/type/ca";
import {
  Box,
  Button,
  Card,
  Chip,
  Pagination,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default function CATable({
  cas,
  handleSearchQoute,
  handleCreateQoute,
  onPageChange,
  onRowsPerPageChange,
  count,
  page,
  rowsPerPage,
}: {
  cas: CAWithQouteCount[];
  handleSearchQoute: (ca: string) => void;
  handleCreateQoute: (ca: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowPerPage: number) => void;
  count: number;
  page: number;
  rowsPerPage: number;
}) {
  return (
    <Card sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell width="10%" align="center">จัดการ</StyledTableCell>
              <StyledTableCell width="15%">หมายเลขผู้ใช้ไฟ</StyledTableCell>
              <StyledTableCell width="15%">หมายเลขมิเตอร์</StyledTableCell>
              <StyledTableCell width="25%">ชื่อผู้ใช้ไฟ</StyledTableCell>
              <StyledTableCell width="35%">ที่อยู่</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cas.map((row, i) => (
              <StyledTableRow key={i}>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {row.quoteCount > 0 && (
                      <Tooltip title="ค้นหาใบเสนอราคา">
                        <Button
                          size="small"
                          sx={{ minWidth: 'auto', mx: 0.5 }}
                          variant="outlined"
                          color="info"
                          onClick={() => handleSearchQoute(row.ca)}
                        >
                          <SearchIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip title="สร้างใบเสนอราคาใหม่">
                      <Button
                        size="small"
                        sx={{ minWidth: 'auto', mx: 0.5 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCreateQoute(row.ca)}
                      >
                        <AddCircleOutlineIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{row.ca}</TableCell>
                <TableCell>{row.meter}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 400 }}>
                    {row.address}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ))}
            {cas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    ไม่พบข้อมูลผู้ใช้ไฟ
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={(e, v) => onPageChange(v)}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="แถวต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`}
          onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        />
      </Box>
    </Card>
  );
}

function CellChip({
  component,
  color,
}: {
  component: any;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}) {
  return (
    <Chip
      sx={{
        width: "98%",
        fontSize: "12px",
        height: 60,
        margin: "0.5rem 0 0 0",
      }}
      label={component}
      clickable={false}
      color={color ? color : "primary"}
    />
  );
}

{
  /* <TableContainer className="mt-3">
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell>หมายเลขผู้ใช้ไฟ</StyledTableCell>
            <StyledTableCell>ชื่อ</StyledTableCell>
            <StyledTableCell>ที่อยู่</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cas.map((row) => (
            <StyledTableRow key={row.ca}>
              <StyledTableCell
                sx={{ width: 150 }}
                align="right"
                className="flex flex-row"
              >
                {row.quoteCount > 0 && (
                  <Button
                    sx={{ width: 30 }}
                    onClick={() => handleSearchQoute(row.ca)}
                  >
                    <SearchIcon />
                  </Button>
                )}
                <Button
                  sx={{ width: 30 }}
                  onClick={() => handleCreateQoute(row.ca)}
                >
                  <AddCircleOutlineIcon />
                </Button>
              </StyledTableCell>
              <StyledTableCell>{row.ca}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.address}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {cas.length == 0 && <Typography>ไม่มีข้อมูล</Typography>}
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(e, v) => onPageChange(v)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
      />
    </TableContainer> */
}
