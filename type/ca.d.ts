export type CA = {
  ca: string;
  name: string;
  address: string;
  tel?: string;
};

export type CAWithQouteCount = CA & {
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
};

export type AccessoryItem = {
  _id: string;
  name: string;
  price: number;
  type: "accessory";
  unit: string;
  labour: number;
};

export type TransformerItem = {
  _id: string;
  name: string;
  price: number;
  type: "transformer";
  product: string;
  unit: string;
  labour: number;
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
  item : Package;
  amount: number
}

export type CAQoute = {
  _id: string;
  customer: CA;
  package: PackageAmount[];
  accessory: AccessoryItemAmount[];
  transformer: TransformerItemAmount[];
};

export type MaterialData = {
  itemList: AccessoryItem[];
  thermalPackage: Package[];
  premuimPackage: Package[];
  standardPackage: Package[];
  transformer: TransformerItem[];
};
