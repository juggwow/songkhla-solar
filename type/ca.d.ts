export type CA = {
  ca: string;
  name: string;
  address: string;
  tel?: string;
  peaNo?: string;
  kVA?: string;
  trType?: string;
  sign?: string;
  rank?: string;
};

export type SearchCA = Pick<CA, "ca" | "name" | "address"> & { meter: string };

export type CAWithQouteCount = SearchCA & {
  quoteCount: number;
};

export type TableCA = {
  page: number;
  rowsPerPage: number;
};

export type Package = {
  _id: string;
  name: string;
  price: number;
  type: string;
  longName: string;
  profit: number;
};

export type AccessoryItem = {
  _id: string;
  name: string;
  price: number;
  type: "accessory";
  unit: string;
  labour: number;
  subType: string;
  longName: string;
  profit: number;
};

export type TransformerItem = {
  _id: string;
  name: string;
  price: number;
  type: "transformer";
  product: string;
  unit: string;
  labour: number;
  profit: number;
};

export type AccessoryItemAmount = {
  item: AccessoryItem;
  amount: number;
};

export type TransformerItemAmount = {
  item: TransformerItem;
  amount: number;
};

export type PackageAmount = {
  item: Package;
  amount: number;
};

export type CAQoute = {
  _id: string;
  customer: CA;
  package: PackageAmount[];
  accessory: AccessoryItemAmount[];
  transformer: TransformerItemAmount[];
};

export type Qouter = {
  qouter: string;
  qouterRank: string;
  qouterTel: string;
};

export type MaterialData = {
  itemList: AccessoryItem[];
  thermalPackage: Package[];
  premuimPackage: Package[];
  standardPackage: Package[];
  hotlinePackage: Package[];
  ugPackage: Package[];
  transformer: TransformerItem[];
  qouterlist: Qouter[];
};

export type ServiceHistory = {
  _id : string,
  ca: string,
  trCode: string,
  lastService: string,
  kva: string
}

export type PeaNo = {
  NO: "ERROR" | "OK",
  MSG_RETURN : string | undefined,
  CA: string,
  TR_CODE: string,
  KVA_TYPE: string,
  KVA: string,
  LOCATION: string,
  LONGITUDE: string,
  LATITUDE: string,
}

export type PeaNoTable = {
  Table: PeaNo[]
}
