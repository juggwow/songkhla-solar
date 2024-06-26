import {
  Autocomplete,
  Box,
  Button,
  Chip,
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
  PackageAmount,
  Qouter,
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
import { convertNumToString } from "@/lib/util";

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
    qouterlist,
  } = useMaterial();

  const { alert, loading } = useAlertLoading();

  const { clearCATable } = useSearchCAQoute();

  const [ca, setCA] = useState<CA>(
    caQoute
      ? caQoute.customer
      : {
          ca: "",
          name: "",
          tel: "",
          address: "",
          peaNo: "",
          kVA: "",
          trType: "",
          sign: "",
          rank: "",
        },
  );
  const [packages, setPackages] = useState<PackageAmount[]>(
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
  const [accList, setAccList] = useState<AccessoryItem[]>([]);
  const [accSubTypeSelection, setAccSubTypeSelection] = useState<string | null>(
    null,
  );
  const [trSizeSelection, setTrSizeSelection] = useState<string | null>(null);
  const [qouter, setQouter] = useState<Qouter>({
    qouter: "",
    qouterRank: "",
    qouterTel: "",
  });

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
    v: string | null,
  ) => {
    setAccSubTypeSelection(v);
    if (!v) {
      setTrList([]);
      return;
    }
    const accs = itemList as AccessoryItem[];
    let accslist = accs.filter((val) => {
      return val.subType == v;
    });
    setAccList(accslist);
  };

  const handleAutoCompleteAddAccessory = (
    e: React.SyntheticEvent<Element, Event> | null,
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
    let p: PackageAmount[] = [];
    if (!isSelected) {
      p = packages.filter((val) => {
        return val.item.type != pac.type;
      });
      setPackages([...p, { item: pac, amount: 1 }]);
    } else {
      p = packages.filter((val) => {
        return val.item.name != pac.name;
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
    loading(true);
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
    loading(false);
    if (res.status !== 200) {
      alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกได้", "error");
      console.log("err");
      return;
    }
    alert("บันทึกสำเร็จ", "success");
    clearCATable();
  };

  const handleDelete = async (id: string) => {
    loading(true);
    const res = await fetch(`/api/ca/ca-qoute/${id}`, {
      method: "DELETE",
    });
    loading(false);
    if (res.status !== 200) {
      console.log("err");
      alert("เกิดข้อผิดพลาด ไม่สามารถลบได้", "error");
      return;
    }
    alert("ลบสำเร็จ", "success");
    clearCATable();
    router.push("/");
  };

  const handleDownload = async (caQoute: CAQoute | null) => {
    if (!caQoute) {
      alert("ไม่มีข้อมูลผู้ใช้ไฟ", "warning");
      return;
    }
    loading(true);
    const thisQoute: CAQoute = {
      _id: caQoute._id,
      customer: ca,
      package: packages,
      accessory: itemsAmount,
      transformer: transformerAmount,
    };
    const data = convertData(thisQoute, total);
    const option = {
      method: "POST",
      body: JSON.stringify({
        name: ca.name,
        ca: ca.ca,
        peaNo: ca.peaNo,
        kVA: ca.kVA,
        trType: ca.trType,
        sign: ca.sign,
        rank: ca.rank,
        data,
        qouter: qouter.qouter,
        qouterTel: qouter.qouterTel,
        qouterRank: qouter.qouterRank,
      }),
    };
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbyBoN5ygzqqkcGqCUsKIna5onxqLXW-Yb0Wm1MaRkdSLGtok0nCH_lqRyCRCP4dQKk1/exec",
      option,
    );
    const { msg } = await res.json();
    loading(false);
    if (msg == "error") {
      alert("ไม่สามารถ Download เอกสารได้ กรุณาลองใหม่อีกครั้ง", "error");
      console.log("error");
      return;
    }

    alert("Download สำเร็จ", "success");
    const pdfBlob = Buffer.from(msg as string, "base64");
    const pdfUrl = URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" }),
    );

    window.open(pdfUrl, "_blank");
  };

  const total = useMemo(() => {
    let total = 0;
    for (const pac of packages) {
      total = total + pac.item.price * (1 + pac.item.profit);
    }
    for (const it of itemsAmount) {
      total =
        total +
        it.amount * (it.item.price + it.item.labour) * (1 + it.item.profit);
    }
    for (const it of transformerAmount) {
      total =
        total +
        it.amount * (it.item.price + it.item.labour) * (1 + it.item.profit);
    }
    return total;
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
  }, [transformer]);

  const accessoryTypeList = useMemo(() => {
    const accs: AccessoryItem[] = itemList;
    let list: string[] = [];
    for (const acc of accs) {
      list.push(acc.subType);
    }
    return list.filter((value, index, array) => {
      return array.indexOf(value) === index;
    });
  }, [itemList]);

  useEffect(() => {
    loading(false);
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
        <span>ชื่อผู้ลงนาม: </span>

        <TextField
          value={ca.sign}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, sign: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>เรียนถึง: </span>

        <TextField
          value={ca.rank}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, rank: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>PEA NO: </span>

        <TextField
          value={ca.peaNo}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, peaNo: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>ขนาดของหม้อแปลง kVA: </span>

        <TextField
          value={ca.kVA}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, kVA: e.target.value })}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>ชนิดของหม้อแปลง: </span>

        <TextField
          value={ca.trType}
          variant="standard"
          sx={{ width: "300px" }}
          onChange={(e) => setCA({ ...ca, trType: e.target.value })}
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
      <div className="flex flex-row flex-wrap gap-3 items-center mt-3">
        <span>ผู้เสนอราคา: </span>
        <Autocomplete
          id="combo-box-demo"
          disablePortal
          options={qouterlist}
          onChange={(e, v) => {
            v ? setQouter(v) : undefined;
          }}
          value={qouter}
          sx={{
            fontSize: "12px",
            width: "300px",
            margin: "1rem",
          }}
          getOptionLabel={(option) => option.qouter}
          renderInput={(params) => (
            <TextField color="secondary" variant="standard" {...params} />
          )}
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
              isSelected={hasSelected(packages, val)}
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
              isSelected={hasSelected(packages, val)}
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
              isSelected={hasSelected(packages, val)}
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
                  <CellChip
                    component={convertNumToString(
                      row.item.price * (1 + row.item.profit),
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.price * (1 + row.item.profit) * row.amount,
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.labour * (1 + row.item.profit),
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.labour * (1 + row.item.profit) * row.amount,
                    )}
                  />
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
            <Box sx={{ height: "400px" }} className="flex flex-col">
              <Autocomplete
                id="combo-box-demo"
                disablePortal
                options={accessoryTypeList}
                onChange={handleAutoCompleteAccessory}
                value={accSubTypeSelection}
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
                    label="ประเภท"
                  />
                )}
              />
              {accList.length > 0 && (
                <Autocomplete
                  id="combo-box-demo"
                  disablePortal
                  options={accList}
                  getOptionLabel={(option) => option.name}
                  onChange={handleAutoCompleteAddAccessory}
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
                      label="รายการ"
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
                  <CellChip
                    component={convertNumToString(
                      row.item.price * (1 + row.item.profit),
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.price * (1 + row.item.profit) * row.amount,
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.labour * (1 + row.item.profit),
                    )}
                  />
                </TableCell>
                <TableCell sx={{ border: "none", width: 175, padding: "0" }}>
                  <CellChip
                    component={convertNumToString(
                      row.item.labour * (1 + row.item.profit) * row.amount,
                    )}
                  />
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
              flexWrap:"wrap"
            }}
          >
            <Typography>
              รวมเป็นเงินทั้งสิ้น {convertNumToString(total * 1.07)} บาท
              รวมภาษีมูลค่าเพิ่ม 7%
            </Typography>
            <Box>
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
            {convertNumToString(
              standardPackage.price * (1 + standardPackage.profit),
            )}{" "}
            บาท
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

function hasSelected(pacs: PackageAmount[], pac: Package): boolean {
  let packages: string[] = [];
  for (const p of pacs) {
    packages.push(p.item._id);
  }
  return packages.includes(pac._id);
}

function convertData(caQoute: CAQoute, total: number) {
  let data = "";
  let itemindex = 1;
  if (caQoute.package.length != 0) {
    caQoute.package.forEach((val, i) => {
      data =
        data +
        `${itemindex}. ${val.item.longName} จำนวนเงิน ${convertNumToString(val.item.price * (1 + val.item.profit))} บาท\n`;
      itemindex = itemindex + 1;
    });
  }
  if (caQoute.transformer.length != 0) {
    caQoute.transformer.forEach((val) => {
      data =
        data +
        `${itemindex}. ค่าหม้อแปลงพร้อมติดตั้ง ${val.item.name} จำนวน ${val.amount} ${val.item.unit} จำนวนเงิน ${convertNumToString((val.item.price + val.item.labour) * (1 + val.item.profit) * val.amount)} บาท\n`;
      itemindex = itemindex + 1;
    });
  }
  if (caQoute.accessory.length != 0) {
    data =
      data +
      `${itemindex}. ค่าอุปกรณ์ประกอบหม้อแปลงจำนวน ${caQoute.accessory.length} รายการ ดังนี้\n`;
    caQoute.accessory.forEach((val) => {
      data =
        data +
        `   -${val.item.longName} จำนวน ${val.amount} ${val.item.unit} จำนวนเงิน ${convertNumToString((val.item.price + val.item.labour) * (1 + val.item.profit) * val.amount)} บาท\n`;
    });
  }
  data = data + `ราคารวมทั้งสิ้น จำนวน ${convertNumToString(total)} บาท\n`;
  data =
    data + `ภาษีมูลค่าเพิ่ม 7% จำนวน ${convertNumToString(total * 0.07)} บาท\n`;
  data =
    data +
    `ราคารวมภาษีมูลค่าเพิ่มเป็นเงิน ${convertNumToString(total * 1.07)} บาท`;
  return data;
}
