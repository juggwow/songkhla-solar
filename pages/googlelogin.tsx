import { getSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { Box, CircularProgress, Typography, Container } from "@mui/material";

export default function GoogleLogin() {
  useEffect(() => {
    signIn("google", { callbackUrl: "/" });
    return;
  }, []);
  
  return (
    <Container maxWidth="xs" sx={{ height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <CircularProgress size={60} color="primary" sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight={500} gutterBottom>
          กำลังเข้าสู่ระบบ
        </Typography>
        <Typography color="text.secondary">
          กรุณารอสักครู่ ระบบกำลังดำเนินการ...
        </Typography>
      </Box>
    </Container>
  );
}
