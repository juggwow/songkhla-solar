import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import error from "next/error";
import transformer from "@/lib/transformer";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ComponentModule } from "next/dist/build/webpack/loaders/metadata/types";

type CA = {
  ca: string;
  name: string;
  address: string;
  tel: string;
};

type Package = {
  package: string;
  price: number;
  type: string;
};

type AccessoryItem = {
  name: string;
  price: number;
  type: "accessory";
  unit: string;
};

type TransformerItem = {
  name: string;
  price: number;
  type: "transformer";
  product: string;
  unit: string;
};

type Item = AccessoryItem | TransformerItem;

type ItemAmount = {
  item : Item,
  amount : number
}

const mockCA = [
  {
    ca: "020026267532",
    name: "นางสาวสุชินันท์ แก้วสุขใส",
    address: "88/7 หมู่ที่ 1 ตำบลพะวง อำเภอเมืองสงขลา จังหวัดสงขลา",
    tel: "0950364906",
  },
  {
    ca: "020026267533",
    name: "นายพัฒนะ ศุภไชยมงคล",
    address: "88/6 หมู่ที่ 1 ตำบลพะวง อำเภอเมืองสงขลา จังหวัดสงขลา",
    tel: "0883874774",
  },
];

const standardPackage = [
  {
    package: "TR 1:< 250 kVA",
    price: 3000,
    type: "standard package transformer",
  },
  {
    package: "TR 2:250 - 1,500 kVA",
    price: 7000,
    type: "standard package transformer",
  },
  {
    package: "TR 3:> 1,500 kVA",
    price: 9000,
    type: "standard package transformer",
  },
];

const premuimPackage = [
  {
    package: "Package 1",
    price: 35000,
    type: "premium package transformer",
  },
  {
    package: "Package 2",
    price: 25000,
    type: "premium package transformer",
  },
  {
    package: "Package 3",
    price: 20000,
    type: "premium package transformer",
  },
  {
    package: "Package 4",
    price: 10000,
    type: "premium package transformer",
  },
];

const thermalPackage = [
  {
    package: "ครึ่งวันหรือ < 3.5 ช.ม.",
    price: 12000,
    type: "thermal",
  },
  {
    package: "ครึ่งวันหรือ < 7 ช.ม.",
    price: 18000,
    type: "thermal",
  },
];

const itemList: Item[] = [
  {
    name: "Hotline Clamp & Bail Clamp",
    price: 100,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "Drop Out Fuse Cutout",
    price: 1000,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "Surge Arrester 30kV 5kA",
    price: 100,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "Surge Arrester 0.4kV",
    price: 100,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "LT switch FSD",
    price: 100,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "LT switch",
    price: 100,
    type: "accessory",
    unit: "ชุด",
  },
  {
    name: "Wiring MV",
    price: 100,
    type: "accessory",
    unit: "เมตร",
  },
  {
    name: "Wireing LV",
    price: 100,
    type: "accessory",
    unit: "เมตร",
  },
  ...transformer,
];

export default function Home() {
  const [ca, setCA] = useState<CA | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [itemsAmount, setItemsAmount] = useState<ItemAmount[]>([
    {
      item:{
        name: "Hotline Clamp & Bail Clamp",
        price: 100,
        type: "accessory",
        unit: "ชุด",
      },
      amount: 0
    },
    {
      item:{
        name: "Drop Out Fuse Cutout",
        price: 1000,
        type: "accessory",
        unit: "ชุด",
      },
      amount: 0
    },
    {
      item:{
        name: "Surge Arrester 30kV 5kA",
        price: 100,
        type: "accessory",
        unit: "ชุด",
      },
      amount: 0
    },
  ]);

  const handleAutocomplete = (
    e: React.SyntheticEvent<Element, Event>,
    v: CA | null,
  ) => {
    if (!v) {
      setCA(null);
    } else {
      setCA(v);
    }
  };

  const handleClick = (pac: Package, isSelected?: boolean) => {
    let p: Package[] = [];
    if (!isSelected) {
      p = packages.filter((val) => {
        return val.type != pac.type;
      });
      setPackages([...p, pac]);
    } else {
      p = packages.filter((val) => {
        return val.package != pac.package;
      });
      setPackages(p);
    }
  };

  const handleAdd = (row:ItemAmount,i:number)=>{
    console.log(row)
    let it = itemsAmount
    it[i].amount += 1
    setItemsAmount(it)
  }

  const total = React.useMemo(() => {
    let total = 0;
    for (const pac of packages) {
      total = total + pac.price;
    }
    return total * 1.07;
  }, [packages]);

  return (
    <div className="p-3">
      <div className="flex flex-row flex-wrap gap-3 items-center">
        <span>หมายเลขผู้ใช้ไฟ(CA): </span>
        {!ca && (
          <Autocomplete
            id="combo-box-demo"
            onChange={handleAutocomplete}
            disablePortal
            options={mockCA}
            getOptionLabel={(option) => option.ca}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        )}
        {ca && <span>{ca.ca}</span>}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>ชื่อผู้ใช้ไฟ: </span>
        {!ca && (
          <Autocomplete
            id="combo-box-demo"
            onChange={handleAutocomplete}
            disablePortal
            options={mockCA}
            getOptionLabel={(option) => option.name}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        )}
        {ca && <span>{ca.name}</span>}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>สถานที่: </span>
        {!ca && (
          <Autocomplete
            id="address"
            onChange={handleAutocomplete}
            disablePortal
            options={mockCA}
            getOptionLabel={(option) => option.address}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField
                sx={{ fontSize: "1rem" }}
                variant="standard"
                {...params}
              />
            )}
          />
        )}
        {ca && <span>{ca.address}</span>}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>หมายเลขโทรศัพท์: </span>
        {!ca && (
          <Autocomplete
            id="combo-box-demo"
            onChange={handleAutocomplete}
            disablePortal
            options={mockCA}
            getOptionLabel={(option) => option.address}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        )}
        {ca && <span>{ca.tel}</span>}
      </div>

      <Chip
        sx={{ fontSize: "18px", margin: "1rem 0 0 0" }}
        label={
          <Typography sx={{ margin: "0 3rem 0 0" }}>
            PM Preventive Maintenance
          </Typography>
        }
        color="secondary"
        onClick={() => {}}
        onDelete={() => {}}
        deleteIcon={
          <KeyboardArrowRightIcon
            color="secondary"
            sx={{
              border: "solid 1px",
              backgroundColor: "white",
              borderRadius: "50%",
              fill: "purple",
            }}
          />
        }
      />
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{
            width: "175px",
            fontSize: "16px",
            height: "60px",
            borderRadius: "",
          }}
          label={<Typography>Standard Package</Typography>}
          clickable={false}
          color="primary"
        />
        {standardPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              isSelected={packages.includes(val)}
              handleClick={handleClick}
            />
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{
            width: "175px",
            fontSize: "16px",
            height: "60px",
            borderRadius: "",
          }}
          clickable={false}
          label={<Typography>Premium Package</Typography>}
          color="primary"
        />
        {premuimPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              isSelected={packages.includes(val)}
              handleClick={handleClick}
            />
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{
            width: "175px",
            fontSize: "16px",
            height: "60px",
            borderRadius: "",
          }}
          label={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography>บริการส่องจุดร้อน</Typography>
              <Typography>ด้วยกล้องอินฟาเรต</Typography>
            </Box>
          }
          color="primary"
          clickable={false}
        />
        {thermalPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              handleClick={handleClick}
              isSelected={packages.includes(val)}
            />
          );
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center">
        <Chip
          sx={{ fontSize: "18px", margin: "1rem 0 0 0" }}
          label={
            <Typography sx={{ margin: "0 3rem 0 0" }}>
              Transfomer accessories
            </Typography>
          }
          color="secondary"
          onClick={() => {}}
          onDelete={() => {}}
          deleteIcon={
            <KeyboardArrowRightIcon
              color="secondary"
              sx={{
                border: "solid 1px",
                backgroundColor: "white",
                borderRadius: "50%",
                fill: "purple",
              }}
            />
          }
        />
      </div>

      <Chip
        sx={{
          fontSize: "16px",
          height: "60px",
          borderRadius: "",
          margin: "1rem 0 0 0",
        }}
        label={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography>
              รวมเป็นเงินทั้งสิ้น {total.toLocaleString("th-TH")} บาท
              รวมภาษีมูลค่าเพิ่ม 7%
            </Typography>
          </Box>
        }
        color="info"
        clickable={false}
      />
      <TableContainer>
      <Table
        sx={{ width: 1024, border: "none" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "none", width: 175 }}>
              <CellChip component={"รายการ"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175 }}>
              <CellChip component={"จำนวน"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175 }}>
              <CellChip component={"หน่วย"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175 }}>
              <CellChip component={"ราคาต่อหน่วย (บาท)"} />
            </TableCell>
            <TableCell sx={{ border: "none", width: 175 }}>
              <CellChip component={"ราคารรวม (บาท)"} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemsAmount.map((row, i) => (
            <TableRow key={i}>
              <TableCell sx={{ border: "none", width: 175 }}>
                <CellChip component={row.item.name} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175 }}>
                <CellChip component={row.amount} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175 }}>
                <CellChip component={<Box sx={{display:"flex",flexDirection:"row",alignItems:"center"}}><Typography>{row.item.unit}</Typography><Button onClick={()=>handleAdd(row,i)}><AddCircleOutlineIcon color="success"/></Button></Box>} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175 }}>
                <CellChip component={row.item.price} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175 }}>
                <CellChip component={row.item.price*row.amount} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

function ItemPackage({
  standardPackage,
  isSelected,
  handleClick,
}: {
  standardPackage: Package;
  isSelected?: boolean;
  handleClick: (standardPackage: Package, isSelected?: boolean) => void;
}) {
  return (
    <Chip
      sx={{
        width: "175px",
        fontSize: "16px",
        height: "60px",
        borderRadius: "",
      }}
      label={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>{standardPackage.package}</Typography>
          <Typography>
            {standardPackage.price.toLocaleString("th-TH")} บาท
          </Typography>
        </Box>
      }
      color={isSelected ? "success" : "primary"}
      onClick={() => {
        handleClick(standardPackage, isSelected);
      }}
    />
  );
}

function CellChip({ component }: { component: any }) {
  return (
    <Chip
      sx={{
        width: "150px",
        fontSize: "12px",
        height: 60
      }}
      label={component}
      clickable={false}
      color="primary"
    />
  );
}
