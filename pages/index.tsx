import { Box, Button, Card, CardContent, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { CAQoute, CAWithQouteCount } from "@/type/ca";
import CATable from "@/component/ca-table";
import { useRouter } from "next/router";
import { useSearchCAQoute } from "@/component/search-ca-qoute-context";
import { useAlertLoading } from "@/component/alert-loading";
import QouteTable from "@/component/qoute-table";
import GroupSizesColors from "@/component/switch";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const router = useRouter();
  const {
    searchCA,
    setSearchCA,
    tableCA,
    setTableCA,
    cas,
    setCAs,
    countCA,
    setCountCA,
    showCAQoutes,
    setShowCAQoutes,
  } = useSearchCAQoute();

  const { loading, alert } = useAlertLoading();

  const [bottonSw, setBottonSw] = useState<"right" | "left">("right");

  const handleSearchQoute = async (ca: string) => {
    const res = await fetch(`/api/ca/ca-qoute/${ca}`);
    if (res.status != 200) {
      console.log("error");
      return;
    }
    setShowCAQoutes((await res.json()) as CAQoute[]);
    setBottonSw("left");
  };

  const handleCreateQoute = async (ca: string) => {
    loading(true);
    const res = await fetch("/api/ca/ca-qoute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ca }),
    });
    loading(false);
    if (res.status != 200) {
      alert("เกิดข้อผิดพลาด ไม่สร้างมาสร้างแบบตอบรับได้", "error");
      return;
    }
    const { id } = await res.json();
    router.push(`/qoute/${id}`);
  };

  const handleSearchCAs = useCallback(async () => {
    loading(true);
    const res = await fetch("/api/ca/search-cas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchCA, tableCA }),
    });
    loading(false);
    if (res.status == 200) {
      const {
        cas,
        count,
      }: { cas: CAWithQouteCount[]; count: { count: number } } =
        await res.json();
      setCAs(cas);
      setCountCA(count.count);
      setBottonSw("right");
    }
  }, [loading, searchCA, tableCA, setCAs, setCountCA, setBottonSw]);

  const handleEditQoute = async (id: string) => {
    loading(true);
    router.push(`qoute/${id}`);
  };

  const handleDelete = async (id: string) => {
    loading(true);
    const res = await fetch(`/api/ca/ca-qoute/${id}`, {
      method: "DELETE",
    });
    loading(false);
    if (res.status !== 200) {
      alert("เกิดข้อผิดพลาดในการลบ ลองใหม่อีกครั้ง", "error");
      return;
    }
    let caqs = showCAQoutes.filter((val) => {
      return val._id != id;
    });
    setShowCAQoutes(caqs);
  };

  useEffect(() => {
    handleSearchCAs();
  }, [handleSearchCAs]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            ระบบค้นหาข้อมูลผู้ใช้ไฟฟ้า
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                onChange={(e) => setSearchCA({ ...searchCA, ca: e.target.value })}
                id="ca"
                label="รหัสผู้ใช้ไฟ (CA)"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                onChange={(e) => setSearchCA({ ...searchCA, name: e.target.value })}
                id="name"
                label="ชื่อ-นามสกุล"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                onChange={(e) => setSearchCA({ ...searchCA, meter: e.target.value })}
                id="meter"
                label="หมายเลขมิเตอร์"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                onChange={(e) => setSearchCA({ ...searchCA, address: e.target.value })}
                id="address"
                label="ที่อยู่"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained" 
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => handleSearchCAs()}
              disableElevation
              sx={{ 
                px: 4,
                backgroundColor: '#0056b3 !important',
                color: 'white !important',
                '&:hover': {
                  backgroundColor: '#003d80 !important'
                }
              }}
            >
              ค้นหา
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <GroupSizesColors
              onClick={(l) => setBottonSw(l)}
              rightText={"รายชื่อผู้ใช้ไฟ"}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {bottonSw == "right" && (
            <CATable
              onPageChange={(p) => setTableCA({ ...tableCA, page: p })}
              onRowsPerPageChange={(r) =>
                setTableCA({ ...tableCA, rowsPerPage: r })
              }
              rowsPerPage={tableCA.rowsPerPage}
              page={tableCA.page}
              cas={cas}
              count={countCA}
              handleSearchQoute={handleSearchQoute}
              handleCreateQoute={handleCreateQoute}
            />
          )}
          {bottonSw == "left" && (
            <QouteTable
              showCAQoutes={showCAQoutes}
              handleEditQoute={handleEditQoute}
              handleDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
