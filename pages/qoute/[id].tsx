import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import MapIcon from "@mui/icons-material/Map";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
  PeaNo,
  PeaNoTable,
  Qouter,
  ServiceHistory,
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
      history: [],
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
      }
    );
    if (!resultFindCAQoute) {
      await mongoClient.close();
      return propsnull;
    }
    const caQoute = resultFindCAQoute as unknown as CAQoute;

    const resultFindHistory = await db.collection("history").find(
      { ca: caQoute.customer.ca },
      {
        projection: {
          _id: { $toString: "$_id" },
          ca: 1,
          trCode: 1,
          lastService: 1,
          kva: 1,
        },
      }
    );

    // if (resultFindHistory) {

    // }
    const history: ServiceHistory[] =
      (await resultFindHistory.toArray()) as unknown as ServiceHistory[];

    return { props: { caQoute, history } };
  } catch (e) {
    await mongoClient.close();
    return propsnull;
  }
}) satisfies GetServerSideProps<{
  caQoute: CAQoute | null;
  history: ServiceHistory[];
}>;

export default function Home({
  caQoute,
  history,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

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
        }
  );
  const [packages, setPackages] = useState<PackageAmount[]>(
    caQoute ? caQoute.package : []
  );
  const [itemsAmount, setItemsAmount] = useState<AccessoryItemAmount[]>(
    caQoute ? caQoute.accessory : []
  );
  const [transformerAmount, setTransformerAmount] = useState<
    TransformerItemAmount[]
  >(caQoute ? caQoute.transformer : []);
  const [forceReRender, setForceReRender] = useState(false);
  const [addAccessory, setAddAccessory] = useState(false);
  const [trList, setTrList] = useState<TransformerItem[]>([]);
  const [accList, setAccList] = useState<AccessoryItem[]>([]);
  const [accSubTypeSelection, setAccSubTypeSelection] = useState<string | null>(
    null
  );
  const [trSizeSelection, setTrSizeSelection] = useState<string | null>(null);
  const [qouter, setQouter] = useState<Qouter>({
    qouter: "",
    qouterRank: "",
    qouterTel: "",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [peaNo, setPeaNo] = useState<PeaNo[]>([]);

  const handleAutoCompleteTr = (
    e: React.SyntheticEvent<Element, Event>,
    v: string | null
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
    v: TransformerItem | null
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
              `cell-${tr.item.name}-${
                tr.item.type == "transformer" && tr.item.product
              }`
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
    v: string | null
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
    v: AccessoryItem | null
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
      option
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
      new Blob([pdfBlob], { type: "application/pdf" })
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
  }, [packages, itemsAmount, transformerAmount]);

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
    console.log("use effect");
    loading(false);
    if (!caQoute) return;
    setCA(caQoute.customer);
    setPackages(caQoute.package);
    setItemsAmount(caQoute.accessory);
    setTransformerAmount(caQoute.transformer);

    const getPeaNo = async () => {
      const peaNoTableRespone = await fetch(
        `https://dmsxupload.pea.co.th/tests3/api/TFM/?procedure=CA_RETURN_TR&parameter=4E6B5078-1S80X403-DB2F9145559C;${caQoute.customer.ca}`
      );
      const peaNoTableData = (await peaNoTableRespone.json()) as PeaNoTable;
      let peaNo: PeaNo[] = [];

      if (peaNoTableData.Table[0].NO == "OK") {
        peaNo = peaNoTableData.Table;
      }

      setPeaNo(peaNo)
    };

    getPeaNo()

  }, [caQoute]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        ใบเสนอราคา
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            ข้อมูลลูกค้า
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="หมายเลขผู้ใช้ไฟ (CA)"
                variant="outlined"
                size="small"
                value={ca.ca}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ชื่อผู้ใช้ไฟ"
                variant="outlined"
                size="small"
                value={ca.name}
                onChange={(e) => setCA({ ...ca, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="หมายเลขโทรศัพท์"
                variant="outlined"
                size="small"
                value={ca.tel}
                onChange={(e) => setCA({ ...ca, tel: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="ที่อยู่"
                variant="outlined"
                size="small"
                value={ca.address}
                onChange={(e) => setCA({ ...ca, address: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PEA NO"
                variant="outlined"
                size="small"
                value={ca.peaNo}
                onChange={(e) => setCA({ ...ca, peaNo: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ขนาดของหม้อแปลง kVA"
                variant="outlined"
                size="small"
                value={ca.kVA}
                onChange={(e) => setCA({ ...ca, kVA: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ชนิดของหม้อแปลง"
                variant="outlined"
                size="small"
                value={ca.trType}
                onChange={(e) => setCA({ ...ca, trType: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ชื่อผู้ลงนาม"
                variant="outlined"
                size="small"
                value={ca.sign}
                onChange={(e) => setCA({ ...ca, sign: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="เรียนถึง"
                variant="outlined"
                size="small"
                value={ca.rank}
                onChange={(e) => setCA({ ...ca, rank: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="combo-box-demo"
                options={qouterlist}
                getOptionLabel={(option) => option.qouter}
                onChange={(e, v) => {
                  v ? setQouter(v) : undefined;
                }}
                value={qouter}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ผู้เสนอราคา"
                    variant="outlined"
                    size="small"
                    margin="normal"
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab label="แพคเกจ" />
              <Tab label="หม้อแปลง" />
              <Tab label="อุปกรณ์เสริม" />
              <Tab label="ประวัติการบำรุงรักษา" />
              <Tab label="รายการหม้อแปลง" />
            </Tabs>
          </Box>

          {/* แพคเกจ */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                PM Preventive Maintenance
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Standard Package
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {standardPackage.map((val, i) => (
                    <ItemPackage
                      key={i}
                      standardPackage={val}
                      isSelected={hasSelected(packages, val)}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Premium Package
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {premuimPackage.map((val, i) => (
                    <ItemPackage
                      key={i}
                      standardPackage={val}
                      isSelected={hasSelected(packages, val)}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  บริการส่องจุดร้อนด้วยกล้องอินฟาเรด
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {thermalPackage.map((val, i) => (
                    <ItemPackage
                      key={i}
                      standardPackage={val}
                      isSelected={hasSelected(packages, val)}
                      handleClick={handleClick}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* หม้อแปลง */}
          {activeTab === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Transformer
                </Typography>
                <AnchorMenu
                  hasChange={addAccessory}
                  label={
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      size="small"
                    >
                      เพิ่มรายการ
                    </Button>
                  }
                  component={
                    <Box sx={{ p: 2, width: "400px" }}>
                      <Autocomplete
                        // disablePortal
                        options={transformerTypeList}
                        onChange={handleAutoCompleteTr}
                        value={trSizeSelection}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="หม้อแปลง"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                      {trList.length > 0 && (
                        <Autocomplete
                          // disablePortal
                          options={trList}
                          getOptionLabel={(option) => option.product}
                          onChange={handleAutoCompleteAddTr}
                          value={null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="ผู้ผลิต"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                      )}
                    </Box>
                  }
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>รายการ</TableCell>
                      <TableCell>ผู้ผลิต</TableCell>
                      <TableCell>จำนวน</TableCell>
                      <TableCell align="right">ราคาต่อหน่วย (บาท)</TableCell>
                      <TableCell align="right">ราคารวม (บาท)</TableCell>
                      <TableCell align="right">ค่าแรงต่อหน่วย (บาท)</TableCell>
                      <TableCell align="right">ค่าแรงรวม (บาท)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transformerAmount.map((row, i) => (
                      <TableRow
                        key={i}
                        id={`cell-${row.item.name}-${
                          row.item.type == "transformer" && row.item.product
                        }`}
                      >
                        <TableCell>{row.item.name}</TableCell>
                        <TableCell>
                          {row.item.type == "transformer"
                            ? row.item.product
                            : ""}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 2 }}>{row.amount}</Typography>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleChangeAmountTr(i, "add")}
                              >
                                <AddCircleOutlineIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChangeAmountTr(i, "remove")
                                }
                              >
                                <RemoveCircleOutlineIcon
                                  fontSize="small"
                                  color="error"
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.price * (1 + row.item.profit)
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.price * (1 + row.item.profit) * row.amount
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.labour * (1 + row.item.profit)
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.labour * (1 + row.item.profit) * row.amount
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {transformerAmount.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Typography color="text.secondary">
                            ไม่มีรายการหม้อแปลง
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* อุปกรณ์เสริม */}
          {activeTab === 2 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  อุปกรณ์เสริม
                </Typography>
                <AnchorMenu
                  hasChange={addAccessory}
                  label={
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      size="small"
                    >
                      เพิ่มรายการ
                    </Button>
                  }
                  component={
                    <Box sx={{ p: 2, width: "300px" }}>
                      <Autocomplete
                        // disablePortal
                        options={accessoryTypeList}
                        onChange={handleAutoCompleteAccessory}
                        value={accSubTypeSelection}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="ประเภท"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                      {accList.length > 0 && (
                        <Autocomplete
                          // disablePortal
                          options={accList}
                          getOptionLabel={(option) => option.name}
                          onChange={handleAutoCompleteAddAccessory}
                          value={null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="รายการ"
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                      )}
                    </Box>
                  }
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>รายการ</TableCell>
                      <TableCell>จำนวน</TableCell>
                      <TableCell>หน่วย</TableCell>
                      <TableCell align="right">ราคาต่อหน่วย (บาท)</TableCell>
                      <TableCell align="right">ราคารวม (บาท)</TableCell>
                      <TableCell align="right">ค่าแรงต่อหน่วย (บาท)</TableCell>
                      <TableCell align="right">ค่าแรงรวม (บาท)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itemsAmount.map((row, i) => (
                      <TableRow key={i} id={`cell-${row.item.name}`}>
                        <TableCell>{row.item.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ mr: 2 }}>{row.amount}</Typography>
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleChangeAmountItem(i, "add")}
                              >
                                <AddCircleOutlineIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleChangeAmountItem(i, "remove")
                                }
                              >
                                <RemoveCircleOutlineIcon
                                  fontSize="small"
                                  color="error"
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{row.item.unit}</TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.price * (1 + row.item.profit)
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.price * (1 + row.item.profit) * row.amount
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.labour * (1 + row.item.profit)
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {convertNumToString(
                            row.item.labour * (1 + row.item.profit) * row.amount
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {itemsAmount.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Typography color="text.secondary">
                            ไม่มีรายการอุปกรณ์เสริม
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* ประวัติการบำรุงรักษา */}
          {activeTab === 3 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  ประวัติการบำรุงรักษา
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>หมายเลขผู้ใช้ไฟ</TableCell>
                      <TableCell>Pea-No</TableCell>
                      <TableCell>ขนาดหม้อแปลง (kVA)</TableCell>
                      <TableCell>วันที่บำรุงรักษา</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((row, i) => (
                      <TableRow key={i} id={`cell-${row._id}`}>
                        <TableCell>{row.ca}</TableCell>
                        <TableCell>{row.trCode}</TableCell>
                        <TableCell>{row.kva}</TableCell>
                        <TableCell>{row.lastService}</TableCell>
                      </TableRow>
                    ))}
                    {history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Typography color="text.secondary">
                            ไม่มีประวัติการบำรุงรักษา
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* ข้อมูลหม้อแปลง */}
          {activeTab === 4 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  ข้อมูลหม้อแปลงของผู้ใช้ไฟ
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>หมายเลขหม้อแปลง (PEA No.)</TableCell>
                      <TableCell>ขนาดหม้อแปลง(kVA)/เฟส</TableCell>
                      <TableCell>สถานที่</TableCell>
                      <TableCell>แผนที่</TableCell>
                      <TableCell>ใช้ค่า</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {peaNo.map((row, i) => (
                      <TableRow key={i} id={`cell-${i}`}>
                        <TableCell>{row.TR_CODE}</TableCell>
                        <TableCell>
                          {row.KVA}/{row.KVA_TYPE}
                        </TableCell>
                        <TableCell>{row.LOCATION}</TableCell>
                        <TableCell>
                          <IconButton
                            href={`https://www.google.com/maps/search/?api=1&query=${row.LATITUDE},${row.LONGITUDE}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              setCA({ ...ca, peaNo: row.TR_CODE, kVA: row.KVA })
                            }
                          >
                            <EditNoteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {peaNo.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                          <Typography color="text.secondary">
                            ไม่มีสามารถแสดงข้อมูลได้ด้วยข้อจำกัดบางอย่าง
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={500}>
                ราคารวมทั้งสิ้น: {convertNumToString(total * 1.07)} บาท
                (รวมภาษีมูลค่าเพิ่ม 7%)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  sx={{
                    px: 4,
                    backgroundColor: "#0056b3 !important",
                    color: "white !important",
                    "&:hover": {
                      backgroundColor: "#003d80 !important",
                    },
                  }}
                  startIcon={<SaveIcon />}
                  onClick={() => caQoute && handleSave(caQoute._id)}
                >
                  บันทึก
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disableElevation
                  sx={{
                    px: 4,
                    backgroundColor: "#0056b3 !important",
                    color: "white !important",
                    "&:hover": {
                      backgroundColor: "#003d80 !important",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => caQoute && handleDelete(caQoute._id)}
                >
                  ลบ
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  disableElevation
                  sx={{
                    px: 4,
                    backgroundColor: "#0056b3 !important",
                    color: "white !important",
                    "&:hover": {
                      backgroundColor: "#003d80 !important",
                    },
                  }}
                  startIcon={<PrintIcon />}
                  onClick={() => handleDownload(caQoute)}
                >
                  พิมพ์
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
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
              standardPackage.price * (1 + standardPackage.profit)
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
        `${itemindex}. ${val.item.longName} จำนวนเงิน ${convertNumToString(
          val.item.price * (1 + val.item.profit)
        )} บาท\n`;
      itemindex = itemindex + 1;
    });
  }
  if (caQoute.transformer.length != 0) {
    caQoute.transformer.forEach((val) => {
      data =
        data +
        `${itemindex}. ค่าหม้อแปลงพร้อมติดตั้ง ${val.item.name} จำนวน ${
          val.amount
        } ${val.item.unit} จำนวนเงิน ${convertNumToString(
          (val.item.price + val.item.labour) *
            (1 + val.item.profit) *
            val.amount
        )} บาท\n`;
      itemindex = itemindex + 1;
    });
  }
  if (caQoute.accessory.length != 0) {
    data =
      data +
      `${itemindex}. รายการอื่นๆ ${caQoute.accessory.length} รายการ ดังนี้\n`;
    caQoute.accessory.forEach((val) => {
      data =
        data +
        `   -${val.item.longName} จำนวน ${val.amount} ${
          val.item.unit
        } จำนวนเงิน ${convertNumToString(
          (val.item.price + val.item.labour) *
            (1 + val.item.profit) *
            val.amount
        )} บาท\n`;
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
