import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import transformer from "@/lib/transformer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AnchorMenu from "@/component/anchor-menu";
import { CA, CAQoute, CAWithQouteCount, TableCA } from "@/type/ca";
import CATable from "@/component/ca-table";
import { useRouter } from "next/router";
import { useSearchCAQoute } from "@/component/search-ca-qoute-context";

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

  const handleSearchQoute = async (ca: string) => {
    const res = await fetch(`/api/ca/ca-qoute/${ca}`);
    if (res.status != 200) {
      console.log("error");
      return;
    }
    setShowCAQoutes((await res.json()) as CAQoute[]);
  };

  const handleCreateQoute = async (ca: string) => {
    const res = await fetch("/api/ca/ca-qoute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ca }),
    });
    if (res.status != 200) {
      return;
    }
    const { id } = await res.json();
    router.push(`/qoute/${id}`);
  };

  const handleSearchCAs = async () => {
    const res = await fetch("/api/ca/search-cas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchCA, tableCA }),
    });
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

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/ca/ca-qoute/${id}`, {
      method: "DELETE",
    });
    if (res.status !== 200) {
      console.log("err");
      return;
    }
    let caqs = showCAQoutes.filter((val) => {
      return val._id != id;
    });
    setShowCAQoutes(caqs);
  };

  // const handleChangeCATable = async (page: number, rowsPerPage: number) => {
  //   setTableCA({ page, rowsPerPage });
  //   const res = await fetch("/api/ca/search-cas", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ searchCA, tableCA: { page, rowsPerPage } }),
  //   });
  //   if (res.status == 200) {
  //     const { cas, count }: { cas: CA[]; count: { count: number } } =
  //       await res.json();
  //     setCAs(cas);
  //     setCountCA(count.count);
  //   }
  // };

  useEffect(() => {
    if (searchCA.address == "" && searchCA.ca == "" && searchCA.name == "") {
      return;
    }
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
            <Button onClick={() => router.push(`qoute/${val._id}`)}>
              แก้ไข
            </Button>
            <Button onClick={() => handleDelete(val._id)}>ลบ</Button>
          </Box>
        );
      })}
    </div>
  );
}
