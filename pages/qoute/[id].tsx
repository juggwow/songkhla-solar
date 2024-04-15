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
import { useEffect, useMemo, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import AnchorMenu from "@/component/anchor-menu";
import {
  AccessoryItem,
  AccessoryItemAmount,
  CA,
  CAQoute,
  Package,
  TransformerItem,
  TransformerItemAmount,
} from "@/type/ca";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { useMaterial } from "@/component/meterial-context";
import { useSearchCAQoute } from "@/component/search-ca-qoute-context";
import { useAlertLoading } from "@/component/alert-loading";

export const getServerSideProps = (async (context) => {
  const propsnull = {
    props: {
      caQoute: null,
    },
  };
  if (
    !context.params ||
    !context.params.id ||
    typeof context.params.id != "string"
  ) {
    return propsnull;
  }
  const id = context.params.id;
  if (typeof id != "string") {
    return propsnull;
  }

  const mongoClient = await clientPromise;
  await mongoClient.connect();

  const db = mongoClient.db("digital-tr");

  try {
    const resultFindCAQoute = await db.collection("ca-qoute").findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          _id: { $toString: "$_id" },
          customer: 1,
          package: 1,
          transformer: 1,
          accessory: 1,
        },
      },
    );
    if (!resultFindCAQoute) {
      await mongoClient.close();
      return propsnull;
    }
    const caQoute = resultFindCAQoute as unknown as CAQoute;

    return { props: { caQoute } };
  } catch (e) {
    await mongoClient.close();
    return propsnull;
  }
}) satisfies GetServerSideProps<{ caQoute: CAQoute | null }>;

export default function Home({
  caQoute,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  useEffect(() => {
    if (!caQoute) {
      router.push("/");
    }
  }, []);

  const {
    itemList,
    thermalPackage,
    premuimPackage,
    standardPackage,
    transformer,
  } = useMaterial();

  const {alert,loading} = useAlertLoading()

  const {clearCATable} = useSearchCAQoute()

  const [ca, setCA] = useState<CA>(
    caQoute
      ? caQoute.customer
      : {
          ca: "",
          name: "",
          tel: "",
          address: "",
        },
  );
  const [packages, setPackages] = useState<Package[]>(
    caQoute ? caQoute.package : [],
  );
  const [itemsAmount, setItemsAmount] = useState<AccessoryItemAmount[]>(
    caQoute ? caQoute.accessory : [],
  );
  const [transformerAmount, setTransformerAmount] = useState<
    TransformerItemAmount[]
  >(caQoute ? caQoute.transformer : []);
  const [forceReRender, setForceReRender] = useState(false);
  const [addAccessory, setAddAccessory] = useState(false);
  const [trList, setTrList] = useState<TransformerItem[]>([]);
  const [trSizeSelection, setTrSizeSelection] = useState<string | null>(null);

  const handleAutoCompleteTr = (
    e: React.SyntheticEvent<Element, Event>,
    v: string | null,
  ) => {
    setTrSizeSelection(v);
    if (!v) {
      setTrList([]);
      return;
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
      if (
        tr.item.name == v.name &&
        tr.item.type == "transformer" &&
        v.product == tr.item.product
      ) {
        setAddAccessory(!addAccessory);
        document
          .getElementById(`cell-${tr.item.name}-${tr.item.product}`)
          ?.classList.add("shake");
        setTimeout(() => {
          document
            .getElementById(
              `cell-${tr.item.name}-${tr.item.type == "transformer" && tr.item.product}`,
            )
            ?.classList.remove("shake");
        }, 1000);
        return;
      }
    }
    setAddAccessory(!addAccessory);
    setTransformerAmount([...transformerAmount, { item: v, amount: 1 }]);
  };

  const handleAutoCompleteAccessory = (
    e: React.SyntheticEvent<Element, Event>,
    v: AccessoryItem | null,
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
        return val.name != pac.name;
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

  const handleSave = async (id: string) => {
    loading(true)
    const res = await fetch(`/api/ca/ca-qoute/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: ca,
        package: packages,
        transformer: transformerAmount,
        accessory: itemsAmount,
      }),
    });
    loading(false)
    if (res.status !== 200) {
      alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้","error")
      console.log("err");
      return;
    }
    alert("บันทึกสำเร็จ","success")
    clearCATable()
  };

  const handleDelete = async (id: string) => {
    loading(true)
    const res = await fetch(`/api/ca/ca-qoute/${id}`, {
      method: "DELETE",
    });
    loading(false)
    if (res.status !== 200) {
      console.log("err");
      alert("เกิดข้อผิดพลาด ไม่สามารถลบได้","error")
      return;
    }
    alert("ลบสำเร็จ","success")
    clearCATable()
    router.push("/");
  };

  const handleDownload = async(caQoute:CAQoute|null)=>{
    if(!caQoute){
      return
    }
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caQoute),
    })
    if(res.status!=200){
      console.log("error")
      return
    }
    // สร้าง URL สำหรับดาวน์โหลด PDF
    const {file} = await res.json()
    const pdfBlob = Buffer.from(file as string, 'base64');
    const pdfUrl = URL.createObjectURL(new Blob([pdfBlob]));

    // สร้างลิงก์สำหรับดาวน์โหลด PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'generated_pdf.pdf';
    downloadLink.click();
  }

  const total = useMemo(() => {
    let total = 0;
    for (const pac of packages) {
      total = total + pac.price;
    }
    for (const it of itemsAmount) {
      total = total + it.amount * (it.item.price + it.item.labour);
    }
    for (const it of transformerAmount) {
      total = total + it.amount * (it.item.price + it.item.labour);
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
        <TextField
          value={ca.ca}
          variant="standard"
          disabled
          sx={{ width: "300px" }}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>ชื่อผู้ใช้ไฟ: </span>

        <TextField
          value={ca.name}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, name: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>สถานที่: </span>
        <TextField
          value={ca.address}
          variant="standard"
          sx={{ width: "500px" }}
          onChange={(e) => setCA({ ...ca, address: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>หมายเลขโทรศัพท์: </span>
        <TextField
          value={ca.tel}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, tel: e.target.value })}
        />
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
          color="secondary"
        />
        {standardPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              isSelected={hasSelected(packages,val)}
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
          color="secondary"
        />
        {premuimPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              isSelected={hasSelected(packages,val)}
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
          color="secondary"
          clickable={false}
        />
        {thermalPackage.map((val, i) => {
          return (
            <ItemPackage
              key={i}
              standardPackage={val}
              handleClick={handleClick}
              isSelected={hasSelected(packages,val)}
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
            <Box sx={{ height: "400px" }} className="flex flex-col">
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
                  getOptionLabel={(option) => option.product}
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
          sx={{ width: 1100, border: "none" }}
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
                <CellChip component={"ราคารวม (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ค่าแรงต่อหน่วย (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ค่าแรงรวม (บาท)"} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transformerAmount.map((row, i) => (
              <TableRow
                id={`cell-${row.item.name}-${row.item.type == "transformer" && row.item.product}`}
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
                      row.item.type == "transformer" && (
                        <Typography sx={{ textWrap: "wrap", fontSize: "12px" }}>
                          {row.item.product}
                        </Typography>
                      )
                    }
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={
                      <div className="flex flex-row justify-between items-center p-0">
                        <span className="">{row.amount}</span>
                        <div>
                          <button
                            onClick={() => handleChangeAmountTr(i, "add")}
                          >
                            <AddCircleOutlineIcon color="success" />
                          </button>
                          <button
                            onClick={() => handleChangeAmountTr(i, "remove")}
                          >
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
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.labour} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.labour * row.amount} />
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
          sx={{ width: 1100, border: "none" }}
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
                <CellChip component={"ราคารวม (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ค่าแรงต่อหน่วย (บาท)"} />
              </TableCell>
              <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                <CellChip component={"ค่าแรงรวม (บาท)"} />
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
                          <button
                            onClick={() => handleChangeAmountItem(i, "add")}
                          >
                            <AddCircleOutlineIcon color="success" />
                          </button>
                          <button
                            onClick={() => handleChangeAmountItem(i, "remove")}
                          >
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
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.labour} />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip component={row.item.labour * row.amount} />
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
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography>
              รวมเป็นเงินทั้งสิ้น {total.toLocaleString("th-TH")} บาท
              รวมภาษีมูลค่าเพิ่ม 7%
            </Typography>
            <Button onClick={() => caQoute && handleSave(caQoute._id)}>
              <SaveIcon />
            </Button>
            <Button onClick={() => caQoute && handleDelete(caQoute._id)}>
              <DeleteIcon />
            </Button>
            <Button onClick={() => handleDownload(caQoute)}>
              <PrintIcon />
            </Button>
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
          <Typography>{standardPackage.name}</Typography>
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

function hasSelected(pacs:Package[],pac:Package):boolean{
  let packages:string[] = []
  for(const p of pacs){
    packages.push(p._id)
  }
  return packages.includes(pac._id)
}
