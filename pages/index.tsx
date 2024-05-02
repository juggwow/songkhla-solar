import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CAQoute, CAWithQouteCount } from "@/type/ca";
import CATable from "@/component/ca-table";
import { useRouter } from "next/router";
import { useSearchCAQoute } from "@/component/search-ca-qoute-context";
import { useAlertLoading } from "@/component/alert-loading";
import QouteTable from "@/component/qoute-table";
import GroupSizesColors from "@/component/switch";

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

  const handleSearchCAs = async () => {
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
  };

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
  }, [tableCA]);

  return (
    <div className="p-3 flex flex-col">
      <Typography>ค้นหาผู้ใช้ไฟ</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <TextField
          color="warning"
          onChange={(e) => setSearchCA({ ...searchCA, ca: e.target.value })}
          id="ca"
          label="ca"
          sx={{ width: "300px" }}
        />
        <TextField
          onChange={(e) => setSearchCA({ ...searchCA, name: e.target.value })}
          id="name"
          label="ชื่อ สกุล"
          sx={{ width: "300px" }}
        />
        <TextField
          onChange={(e) => setSearchCA({ ...searchCA, meter: e.target.value })}
          color="info"
          id="address"
          label="หมายเลขมิเตอร์"
          sx={{ width: "300px" }}
        />
        <TextField
          onChange={(e) =>
            setSearchCA({ ...searchCA, address: e.target.value })
          }
          color="secondary"
          id="address"
          label="ที่อยู่"
          sx={{ width: "300px" }}
        />
      </Box>
      <Button
        sx={{ width: "300px", margin: "1rem 0" }}
        variant="outlined"
        color="secondary"
        onClick={() => handleSearchCAs()}
      >
        ค้นหา
      </Button>

      <Divider />

      <GroupSizesColors
        onClick={(l) => setBottonSw(l)}
        leftText={"ใบเสนอราคา"}
        rightText={"รายชื่อผู้ใช้ไฟ"}
      />

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
    </div>
  );
}
