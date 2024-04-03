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
import { CA, TableCA } from "@/type/ca";
import CATable from "@/component/ca-table";

export default function Home() {
  const [searchCA,setSearchCA] = useState<CA>({
    ca: "",
    name: "",
    address: ""
  })
  const [tableCA,setTableCA] = useState<TableCA>({
    rowsPerPage:10,
    page:0
  })
  const [cas,setCAs] = useState<CA[]>([])
  const [countCA,setCountCA]= useState(0)

  const handleSearchQoute = async(ca:string)=>{
    console.log(ca)
  }

  const handleSearchCAs = async()=>{
    const res = await fetch("/api/ca/search-cas",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({searchCA,tableCA})
    })
    if(res.status == 200){
      const {cas,count}:{cas:CA[],count:{count:number}} = await res.json()
      setCAs(cas)
      setCountCA(count.count)
    }
  }

  const handleChangeCATable = async(page:number,rowsPerPage:number)=>{
    setTableCA({page,rowsPerPage})
    const res = await fetch("/api/ca/search-cas",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({searchCA,tableCA:{page,rowsPerPage}})
    })
    if(res.status == 200){
      const {cas,count}:{cas:CA[],count:{count:number}} = await res.json()
      setCAs(cas)
      setCountCA(count.count)
    }
  }

  return (
    <div className="p-3 flex flex-col">
      <Typography>ค้นหาผู้ใช้ไฟ</Typography>
      
      <TextField onChange={(e)=>setSearchCA({...searchCA,ca:e.target.value})} id="ca" label="ca" className="mt-3" sx={{width:"200px"}} />
      <TextField onChange={(e)=>setSearchCA({...searchCA,name:e.target.value})} id="name" label="ชื่อ สกุล" className="mt-3" sx={{width:"200px"}} />
      <TextField onChange={(e)=>setSearchCA({...searchCA,address:e.target.value})} id="address" label="ที่อยู่" className="mt-3" sx={{width:"200px"}} />

      <Button sx={{width:"200px"}} className="mt-3" variant="outlined" onClick={()=>handleSearchCAs()} >ค้นหา</Button>

      
        <CATable handleChangeTable={handleChangeCATable} cas={cas} count={countCA} handleSearchQoute={handleSearchQoute} />
    </div>
  )
}