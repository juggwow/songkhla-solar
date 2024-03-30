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
import { useMemo, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import transformer from "@/lib/transformer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AnchorMenu from "@/component/anchor-menu";

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
  item: Item;
  amount: number;
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
];

export default function Home() {
  const [ca, setCA] = useState<CA | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [itemsAmount, setItemsAmount] = useState<ItemAmount[]>([]);
  const [transformerAmount, setTransformerAmount] = useState<ItemAmount[]>([]);
  const [forceReRender, setForceReRender] = useState(false);
  const [addAccessory, setAddAccessory] = useState(false);
  const [trList, setTrList] = useState<TransformerItem[]>([]);
  const [trSizeSelection,setTrSizeSelection] = useState<string|null>(null)

  const handleAutocompleteCA = (
    e: React.SyntheticEvent<Element, Event>,
    v: CA | null,
  ) => {
    if (!v) {
      setCA(null);
    } else {
      setCA(v);
    }
  };

  const handleAutoCompleteTr = (
    e: React.SyntheticEvent<Element, Event>,
    v: string | null,
  ) => {
    setTrSizeSelection(v)
    if(!v){
      setTrList([])
      return
    }
    const trs = transformer as TransformerItem[];
    let trslist = trs.filter((val) => {
      return val.name == v;
    });
    setTrList(trslist);
  };

  const handleAutoCompleteAddTr = (
    e: React.SyntheticEvent<Element, Event>,
    v: TransformerItem | null,
  ) => {
    if (!v) {
      setAddAccessory(!addAccessory);
      return;
    }
    for (const tr of transformerAmount) {
      if (tr.item.name == v.name && tr.item.type=="transformer" && v.product == tr.item.product) {
        setAddAccessory(!addAccessory);
        document.getElementById(`cell-${tr.item.name}-${tr.item.product}`)?.classList.add("shake");
        setTimeout(() => {
          document
            .getElementById(`cell-${tr.item.name}-${tr.item.type=="transformer"&&tr.item.product}`)
            ?.classList.remove("shake");
        }, 1000);
        return;
      }
    }
    setAddAccessory(!addAccessory);
    setTransformerAmount([...transformerAmount, { item: v, amount: 1 }]);
  }

  const handleAutoCompleteAccessory = (
    e: React.SyntheticEvent<Element, Event>,
    v: Item | null,
  ) => {
    if (!v) {
      setAddAccessory(!addAccessory);
      return;
    }
    for (const it of itemsAmount) {
      if (it.item.name == v.name) {
        setAddAccessory(!addAccessory);
        document.getElementById(`cell-${it.item.name}`)?.classList.add("shake");
        setTimeout(() => {
          document
            .getElementById(`cell-${it.item.name}`)
            ?.classList.remove("shake");
        }, 1000);
        return;
      }
    }
    setAddAccessory(!addAccessory);
    setItemsAmount([...itemsAmount, { item: v, amount: 1 }]);
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

  const handleChangeAmountItem = (i: number, change: "add" | "remove") => {
    let it = itemsAmount;
    if (change == "add") {
      it[i].amount += 1;
    }
    if (change == "remove" && it[i].amount > 0) {
      it[i].amount -= 1;
    }
    if (
      it[i].amount == 0 &&
      window.confirm("ต้องการเอารายการนี้ออกใช่หรือไม่?")
    ) {
      it = it.filter((val) => {
        return val.amount != 0;
      });
    }
    setForceReRender(!forceReRender);
    setItemsAmount(it);
  };

  const handleChangeAmountTr = (i: number, change: "add" | "remove") => {
    let it = transformerAmount;
    if (change == "add") {
      it[i].amount += 1;
    }
    if (change == "remove" && it[i].amount > 0) {
      it[i].amount -= 1;
    }
    if (
      it[i].amount == 0 &&
      window.confirm("ต้องการเอารายการนี้ออกใช่หรือไม่?")
    ) {
      it = it.filter((val) => {
        return val.amount != 0;
      });
    }
    setForceReRender(!forceReRender);
    setTransformerAmount(it);
  };

  const total = useMemo(() => {
    let total = 0;
    for (const pac of packages) {
      total = total + pac.price;
    }
    for (const it of itemsAmount) {
      total = total + it.amount * it.item.price;
    }
    for (const it of transformerAmount) {
      total = total + it.amount * it.item.price;
    }
    return total * 1.07;
  }, [packages, itemsAmount, forceReRender, transformerAmount]);

  const transformerTypeList = useMemo(() => {
    const trs: TransformerItem[] = transformer;
    let list: string[] = [];
    for (const tr of trs) {
      list.push(tr.name);
    }
    return list.filter((value, index, array) => {
      return array.indexOf(value) === index;
    });
  }, []);

  return (
    <div className="p-3">
      <div className="flex flex-row flex-wrap gap-3 items-center">
        <span>หมายเลขผู้ใช้ไฟ(CA): </span>
        {!ca && (
          <Autocomplete
            id="combo-box-demo"
            onChange={handleAutocompleteCA}
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
            onChange={handleAutocompleteCA}
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
            onChange={handleAutocompleteCA}
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
            onChange={handleAutocompleteCA}
            disablePortal
            options={mockCA}
            getOptionLabel={(option) => option.tel}
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
          <div className="flex flex-row">
            <Typography sx={{ margin: "0 3rem 0 0" }}>
              PM Preventive Maintenance
            </Typography>

            <KeyboardArrowRightIcon
              color="secondary"
              sx={{
                border: "solid 1px",
                backgroundColor: "white",
                borderRadius: "50%",
                fill: "purple",
              }}
            />
          </div>
        }
        color="secondary"
        clickable={false}
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
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{ fontSize: "18px" }}
          label={
            <div className=" flex flex-row">
              <Typography sx={{ margin: "0 3rem 0 0" }}>Transfomer</Typography>
              <KeyboardArrowRightIcon
                color="secondary"
                sx={{
                  border: "solid 1px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  fill: "purple",
                }}
              />
            </div>
          }
          color="secondary"
          clickable={false}
        />
        <AnchorMenu
          hasChange={addAccessory}
          label={
            <div className="flex flex-row items-center">
              <span>เพิ่มรายการ</span>
              <AddCircleOutlineIcon />
            </div>
          }
          component={
            <Box sx={{height:"400px"}} className="flex flex-col">
              <Autocomplete
                id="combo-box-demo"
                disablePortal
                options={transformerTypeList}
                onChange={handleAutoCompleteTr}
                value={trSizeSelection}
                sx={{
                  fontSize: "12px",
                  width: "300px",
                  margin: "1rem",
                }}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    variant="standard"
                    {...params}
                    label="หม้อแปลง"
                  />
                )}
              />
              {trList.length > 0 && (
                <Autocomplete
                id="combo-box-demo"
                disablePortal
                options={trList}
                getOptionLabel={(option)=>option.product}
                onChange={handleAutoCompleteAddTr}
                value={null}
                sx={{
                  fontSize: "12px",
                  width: "300px",
                  margin: "1rem",
                }}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    variant="standard"
                    {...params}
                    label="ผู้ผลิต"
                  />
                )}
              />
              )}
            </Box>
          }
        />
      </div>

      <TableContainer sx={{ padding: 0, margin: "1rem 0" }}>
        <Table
          sx={{ width: 1024, border: "none" }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"รายการ"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ผู้ผลิต"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"จำนวน"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ราคาต่อหน่วย (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ราคารรวม (บาท)"} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transformerAmount.map((row, i) => (
              <TableRow
                id={`cell-${row.item.name}-${row.item.type == "transformer"&&row.item.product}`}
                sx={{ margin: "0.5rem 0 0 0" }}
                key={i}
              >
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                        {row.item.name}
                      </Typography>
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      row.item.type == "transformer" && <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                      {row.item.product}
                    </Typography>
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      <div className="flex flex-row justify-between items-center p-0">
                        <span className="">{row.amount}</span>
                        <div>
                          <button onClick={() => handleChangeAmountTr(i, "add")}>
                            <AddCircleOutlineIcon color="success" />
                          </button>
                          <button onClick={() => handleChangeAmountTr(i, "remove")}>
                            <RemoveCircleOutlineIcon color="success" />
                          </button>
                        </div>
                      </div>
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.price} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.price * row.amount} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <Chip
          sx={{ fontSize: "18px" }}
          label={
            <div className=" flex flex-row">
              <Typography sx={{ margin: "0 3rem 0 0" }}>
                Transfomer accessories
              </Typography>
              <KeyboardArrowRightIcon
                color="secondary"
                sx={{
                  border: "solid 1px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  fill: "purple",
                }}
              />
            </div>
          }
          color="secondary"
          clickable={false}
        />
        <AnchorMenu
          hasChange={addAccessory}
          label={
            <div className="flex flex-row items-center">
              <span>เพิ่มรายการ</span>
              <AddCircleOutlineIcon />
            </div>
          }
          component={
            <Autocomplete
              id="combo-box-demo"
              disablePortal
              options={itemList}
              value={null}
              getOptionLabel={(option) => option.name}
              onChange={handleAutoCompleteAccessory}
              sx={{
                fontSize: "12px",
                width: "300px",
                height: "600px",
                margin: "1rem",
              }}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  variant="standard"
                  {...params}
                  label="เพิ่มรายการ"
                />
              )}
            />
          }
        />
      </div>

      <TableContainer sx={{ padding: 0, margin: "1rem 0" }}>
        <Table
          sx={{ width: 1024, border: "none" }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"รายการ"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"จำนวน"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"หน่วย"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ราคาต่อหน่วย (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ราคารรวม (บาท)"} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsAmount.map((row, i) => (
              <TableRow
                id={`cell-${row.item.name}`}
                sx={{ margin: "0.5rem 0 0 0" }}
                key={i}
              >
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                        {row.item.name}
                      </Typography>
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      <div className="flex flex-row justify-between items-center p-0">
                        <span className="">{row.amount}</span>
                        <div>
                          <button onClick={() => handleChangeAmountItem(i, "add")}>
                            <AddCircleOutlineIcon color="success" />
                          </button>
                          <button onClick={() => handleChangeAmountItem(i, "remove")}>
                            <RemoveCircleOutlineIcon color="success" />
                          </button>
                        </div>
                      </div>
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.unit} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.price} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.price * row.amount} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        height: 60,
        margin: "0.5rem 0 0 0",
      }}
      label={component}
      clickable={false}
      color="primary"
    />
  );
}
