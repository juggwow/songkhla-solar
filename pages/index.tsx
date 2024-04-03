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
import { CA, TableType } from "@/type/ca";
import CATable from "@/component/ca-table";


const mockCA = [
  {
    ca: "020026267532",
    name: "นางสาวสุชินันท์ แก้วสุขใส",
    address: "88/7 หมู่ที่ 1 ตำบลพะวง อำเภอเมืองสงขลา จังหวัดสงขลา",
  },
  {
    ca: "020026267533",
    name: "นายพัฒนะ ศุภไชยมงคล",
    address: "88/6 หมู่ที่ 1 ตำบลพะวง อำเภอเมืองสงขลา จังหวัดสงขลา",
  },
];


export default function Home() {
  const [searchCA,setSearchCA] = useState<CA>({
    ca: "",
    name: "",
    address: ""
  })

  const handleSearchQoute = async(ca:string)=>{
    console.log(ca)
  }

  const handleSearch = async()=>{
    console.log(searchCA)
    return
  }

  const handleChangeCATable = async(page:number,rowsPerPage:number)=>{
    console.log(page,rowsPerPage)
  }

  return (
    <div className="p-3 flex flex-col">
      <Typography>ค้นหาผู้ใช้ไฟ</Typography>
      
      <TextField onChange={(e)=>setSearchCA({...searchCA,ca:e.target.value})} id="ca" label="ca" className="mt-3" sx={{width:"200px"}} />
      <TextField onChange={(e)=>setSearchCA({...searchCA,name:e.target.value})} id="name" label="ชื่อ สกุล" className="mt-3" sx={{width:"200px"}} />
      <TextField onChange={(e)=>setSearchCA({...searchCA,address:e.target.value})} id="address" label="ที่อยู่" className="mt-3" sx={{width:"200px"}} />

      <Button sx={{width:"200px"}} className="mt-3" variant="outlined" onClick={()=>handleSearch()} >ค้นหา</Button>

      {mockCA.length>0&&(
        <CATable handleChangeTable={handleChangeCATable} cas={mockCA} handleSearchQoute={handleSearchQoute} />
      )}
    </div>
  )
}