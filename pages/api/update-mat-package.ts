// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method != "POST") {
    res.status(400).end();
    return;
  }

  if (!req.headers.authorization || req.headers.authorization != process.env.NEXT_PUBLIC_API){
    res.status(401).end()
    return
  }
  const data = JSON.parse(req.body);
  
  const mongoClient = await clientPromise
  await mongoClient.connect()

  try{
    await mongoClient.db("digital-tr").collection("items").drop()
    const collection = await mongoClient.db("digital-tr").createCollection("items")
    
    const updateResult = await collection.insertMany(data)
    if(!updateResult.acknowledged){
      await mongoClient.close()
      res.end(500)
      return
    }
  }
  catch(e){
    console.log(e)
    res.end(500)
    await mongoClient.close()
    return
  }

  res.status(200).json({ name: "John Doe" });
  return
}

const itemList = [
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
