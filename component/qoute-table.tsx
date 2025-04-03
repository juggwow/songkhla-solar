import { convertNumToString, totalQoute } from "@/lib/util";
import { CAQoute } from "@/type/ca";
import {
  Box,
  Typography,
  Button,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableBody,
  Card,
  Table,
  TableContainer,
  Tooltip,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export default function QouteTable({
  showCAQoutes,
  handleEditQoute,
  handleDelete,
}: {
  showCAQoutes: CAQoute[];
  handleEditQoute: (id: string) => void;
  handleDelete: (id: string) => void;
}) {
  return (
    <Card sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell width="10%" align="center">จัดการ</StyledTableCell>
              <StyledTableCell width="15%">หมายเลขผู้ใช้ไฟ</StyledTableCell>
              <StyledTableCell width="20%">ชื่อผู้ใช้ไฟ</StyledTableCell>
              <StyledTableCell width="40%">รายละเอียดหม้อแปลง</StyledTableCell>
              <StyledTableCell width="15%" align="right">วงเงินรวมภาษี (บาท)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showCAQoutes.map((row, i) => (
              <StyledTableRow key={i}>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="แก้ไขใบเสนอราคา">
                      <Button
                        size="small"
                        sx={{ minWidth: 'auto', mx: 0.5 }}
                        variant="outlined"
                        color="info"
                        onClick={() => handleEditQoute(row._id)}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Tooltip title="ลบใบเสนอราคา">
                      <Button
                        size="small"
                        sx={{ minWidth: 'auto', mx: 0.5 }}
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(row._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{row.customer.ca}</TableCell>
                <TableCell>{row.customer.name}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {`PEA-No ${row.customer.peaNo || "-"} ขนาด ${row.customer.kVA || "-"} kVA ชนิด ${row.customer.trType || "-"}`}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    {convertNumToString(totalQoute(
                      row.package,
                      row.transformer,
                      row.accessory,
                    ))}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ))}
            {showCAQoutes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    ไม่พบข้อมูลใบเสนอราคา
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
