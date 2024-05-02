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
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    
      
        
          <Box>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip color="success" component={"Action"} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip color="success" component={"หมายเลขผู้ใช้ไฟ"} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 220, padding: "0" }}>
                  <CellChip color="success" component={"ชื่อผู้ใช้ไฟ"} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 400, padding: "0" }}>
                  <CellChip color="success" component={"รายละเอียดหม้อแปลง"} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip color="success" component={"วงเงินรวมภาษี"} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showCAQoutes.map((row, i) => (
                <TableRow sx={{ margin: "0.5rem 0 0 0" }} key={i}>
                  <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                    <CellChip
                      color={i % 2 == 0 ? "primary" : "warning"}
                      component={
                        <Box>
                          <Button
                            sx={{ width: 30 }}
                            onClick={() => handleEditQoute(row._id)}
                          >
                            <EditIcon color="secondary" />
                          </Button>

                          <Button
                            sx={{ width: 30 }}
                            onClick={() => handleDelete(row._id)}
                          >
                            <DeleteIcon color="secondary" />
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
                          {row.customer.ca}
                        </Typography>
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                    <CellChip
                      color={i % 2 == 0 ? "primary" : "warning"}
                      component={
                        <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                          {row.customer.name}
                        </Typography>
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ border: "none", width: 300, padding: "0" }}>
                    <CellChip
                      color={i % 2 == 0 ? "primary" : "warning"}
                      component={
                        <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                          {`PEA-No ${row.customer.peaNo || "..."} ขนาด ${row.customer.kVA || "..."} kVA ชนิด ${row.customer.trType || "..."}`}
                        </Typography>
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                    <CellChip
                      color={i % 2 == 0 ? "primary" : "warning"}
                      component={
                        <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                          {convertNumToString(totalQoute(
                            row.package,
                            row.transformer,
                            row.accessory,
                          ))}
                        </Typography>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Box>
        

    
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
