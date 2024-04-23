import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { CAQoute, CAWithQouteCount } from "@/type/ca";
import CATable from "@/component/ca-table";
import { useRouter } from "next/router";
import { useSearchCAQoute } from "@/component/search-ca-qoute-context";
import { useAlertLoading } from "@/component/alert-loading";

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

  const handleSearchQoute = async (ca: string) => {
    const res = await fetch(`/api/ca/ca-qoute/${ca}`);
    if (res.status != 200) {
      console.log("error");
      return;
    }
    setShowCAQoutes((await res.json()) as CAQoute[]);
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
    }
  };

  const handleEditQoute =async (id:string)=>{
    loading(true)
    router.push(`qoute/${id}`)  
  }

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

      <TextField
        onChange={(e) => setSearchCA({ ...searchCA, ca: e.target.value })}
        id="ca"
        label="ca"
        className="mt-3"
        sx={{ width: "200px" }}
      />
      <TextField
        onChange={(e) => setSearchCA({ ...searchCA, name: e.target.value })}
        id="name"
        label="ชื่อ สกุล"
        className="mt-3"
        sx={{ width: "200px" }}
      />
      <TextField
        onChange={(e) => setSearchCA({ ...searchCA, address: e.target.value })}
        id="address"
        label="ที่อยู่"
        className="mt-3"
        sx={{ width: "200px" }}
      />

      <Button
        sx={{ width: "200px" }}
        className="mt-3"
        variant="outlined"
        onClick={() => handleSearchCAs()}
      >
        ค้นหา
      </Button>

      <CATable
        onPageChange={(p) => setTableCA({ ...tableCA, page: p })}
        onRowsPerPageChange={(r) => setTableCA({ ...tableCA, rowsPerPage: r })}
        rowsPerPage={tableCA.rowsPerPage}
        page={tableCA.page}
        cas={cas}
        count={countCA}
        handleSearchQoute={handleSearchQoute}
        handleCreateQoute={handleCreateQoute}
      />

      {showCAQoutes.map((val) => {
        return (
          <Box key={val._id}>
            <Typography>{val.customer.name}</Typography>
            <Typography>จำนวนรายการ package: {val.package.length}</Typography>
            <Typography>
              จำนวนรายการหม้อแปลง : {val.transformer.length}
            </Typography>
            <Typography>จำนวนรายการ accessory: {val.package.length}</Typography>
            <Button onClick={()=>handleEditQoute(val._id)}>
              แก้ไข
            </Button>
            <Button onClick={() => handleDelete(val._id)}>ลบ</Button>
          </Box>
        );
      })}
    </div>
  );
}
