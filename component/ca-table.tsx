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
  Chip,
  Pagination,
  TablePagination,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.primary,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#FFEEFF",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
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
    <TableContainer sx={{ padding: 0, margin: "1rem 0" }}>
      <Table
        sx={{ width: 1100, border: "none" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
              <CellChip color="success" component={"Action"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
              <CellChip color="success" component={"หมายเลขผู้ใช้ไฟ"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
              <CellChip color="success" component={"หมายเลขมิเตอร์"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
              <CellChip color="success" component={"ชื่อผู้ใช้ไฟ"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
              <CellChip color="success" component={"ที่อยู่"} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cas.map((row, i) => (
            <TableRow sx={{ margin: "0.5rem 0 0 0" }} key={i}>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip
                  color={i % 2 == 0 ? "primary" : "warning"}
                  component={
                    <Box>
                      {row.quoteCount > 0 && (
                        <Button
                          sx={{ width: 30 }}
                          onClick={() => handleSearchQoute(row.ca)}
                        >
                          <SearchIcon color="secondary" />
                        </Button>
                      )}
                      <Button
                        sx={{ width: 30 }}
                        color="secondary"
                        onClick={() => handleCreateQoute(row.ca)}
                      >
                        <AddCircleOutlineIcon color="secondary" />
                      </Button>
                    </Box>
                  }
                />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip
                  color={i % 2 == 0 ? "primary" : "warning"}
                  component={
                    <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                      {row.ca}
                    </Typography>
                  }
                />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip
                  color={i % 2 == 0 ? "primary" : "warning"}
                  component={
                    <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                      {row.meter}
                    </Typography>
                  }
                />
              </TableCell>
              <TableCell sx={{ border: "none", width: 300, padding: "0" }}>
                <CellChip
                  color={i % 2 == 0 ? "primary" : "warning"}
                  component={
                    <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                      {row.name}
                    </Typography>
                  }
                />
              </TableCell>
              <TableCell sx={{ border: "none", width: 500, padding: "0" }}>
                <CellChip
                  color={i % 2 == 0 ? "primary" : "warning"}
                  component={
                    <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                      {row.address}
                    </Typography>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(e, v) => onPageChange(v)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
      />
    </TableContainer>
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
