import * as React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type CA = {
  ca: string;
  name: string;
  address: string;
  tel: string;
};

type Package = {
  package: string;
  price: number;
};

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
  },
  {
    package: "TR 2:250 - 1,500 kVA",
    price: 7000,
  },
  {
    package: "TR 3:> 1,500 kVA",
    price: 9000,
  },
];

const premuimPackage = [
  {
    package: "Package 1",
    price: 35000,
  },
  {
    package: "Package 2",
    price: 25000,
  },
  {
    package: "Package 3",
    price: 20000,
  },
  {
    package: "Package 4",
    price: 10000,
  },
];

export default function Home() {
  const [ca, setCA] = useState<CA | null>(null);

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
        sx={{ fontSize: "18px" }}
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
            fontSize: "16px",
            margin: "1rem 0 0",
            height: "60px",
            borderRadius: "",
          }}
          label={<Typography>Standard Package</Typography>}
          color="primary"
          onClick={() => {}}
        />
        {standardPackage.map((val, i) => {
          return <ItemPackage key={i} standardPackage={val} isSelected />;
        })}
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{
            fontSize: "16px",
            margin: "1rem 0 0",
            height: "60px",
            borderRadius: "",
          }}
          label={<Typography>Premium Package</Typography>}
          color="primary"
          onClick={() => {}}
        />
        {premuimPackage.map((val, i) => {
          return <ItemPackage key={i} standardPackage={val} isSelected />;
        })}
      </div>
    </div>
  );
}

function ItemPackage({
  standardPackage,
  isSelected,
}: {
  standardPackage: Package;
  isSelected?: boolean;
}) {
  return (
    <Chip
      sx={{
        fontSize: "16px",
        margin: "1rem 0 0",
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
          <Typography>{standardPackage.price} บาท</Typography>
        </Box>
      }
      color={isSelected ? "success" : "primary"}
      onClick={() => {}}
    />
  );
}
