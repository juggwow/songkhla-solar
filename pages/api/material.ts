// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "@/lib/mongodb";
import {
  AccessoryItem,
  MaterialData,
  Package,
  Qouter,
  TransformerItem,
} from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MaterialData>,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }
  if (req.method != "GET") {
    res.status(400).end();
    return;
  }

  const mongoClient = await clientPromise;
  await mongoClient.connect();
  try {
    const itemCollection = mongoClient.db("digital-tr").collection("items");
    const itemList = (await itemCollection
      .find({ type: "accessory" })
      .toArray()) as unknown as AccessoryItem[];
    const thermalPackage = (await itemCollection
      .find({ type: "thermal" })
      .toArray()) as unknown as Package[];
    const premuimPackage = (await itemCollection
      .find({ type: "premium package transformer" })
      .toArray()) as unknown as Package[];
    const standardPackage = (await itemCollection
      .find({ type: "standard package transformer" })
      .toArray()) as unknown as Package[];
    const hotlinePackage = (await itemCollection
      .find({ type: "hotline" })
      .toArray()) as unknown as Package[];
    const ugPackage = (await itemCollection
      .find({ type: "underground" })
      .toArray()) as unknown as Package[];  
    const transformer = (await itemCollection
      .find({ type: "transformer" })
      .toArray()) as unknown as TransformerItem[];
    const qouterlist = (await mongoClient
      .db("digital-tr")
      .collection("qouter")
      .find()
      .toArray()) as unknown as Qouter[];
    res.send({
      itemList,
      thermalPackage,
      premuimPackage,
      standardPackage,
      hotlinePackage,
      ugPackage,
      transformer,
      qouterlist,
    });
  } catch (e) {
    console.log(e);
    res.end(500);
    await mongoClient.close();
    return;
  }
}
