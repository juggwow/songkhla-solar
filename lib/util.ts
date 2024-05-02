import {
  PackageAmount,
  TransformerItemAmount,
  AccessoryItemAmount,
} from "@/type/ca";

export function convertNumToString(num: number) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function totalQoute(
  pacs: PackageAmount[],
  trs: TransformerItemAmount[],
  accs: AccessoryItemAmount[],
) {
  let total = 0;
  for (const pac of pacs) {
    total = total + pac.item.price * (1 + pac.item.profit);
  }
  for (const it of accs) {
    total =
      total +
      it.amount * (it.item.price + it.item.labour) * (1 + it.item.profit);
  }
  for (const it of trs) {
    total =
      total +
      it.amount * (it.item.price + it.item.labour) * (1 + it.item.profit);
  }
  return total;
}
