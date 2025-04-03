import { Container, Typography, Box,Card, CardContent, Alert, AlertTitle } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Unauthorization() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)", borderRadius: 2 }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              ไม่มีสิทธิ์เข้าใช้งาน
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาติดต่อแผนกบริการลูกค้า กฟส.สงขลา เพื่อขอสิทธิ์เข้าใช้งาน
            </Typography>
            <Alert severity="info" sx={{ mb: 4, mx: "auto", maxWidth: 500, textAlign: "left" }}>
              <AlertTitle>ข้อมูลติดต่อ</AlertTitle>
              <Typography variant="body2">
                แผนกบริการลูกค้า การไฟฟ้าส่วนภูมิภาค สาขาสงขลา<br />
                โทรศัพท์: 074-xxx-xxx<br />
                อีเมล: service@peasonngkhla.com
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
