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

  if (
    !req.headers.authorization ||
    req.headers.authorization != process.env.NEXT_PUBLIC_API
  ) {
    res.status(401).end();
    return;
  }
  const data = req.body;
  const mongoClient = await clientPromise;
  await mongoClient.connect();

  try {
    await mongoClient.db("digital-tr").collection("qouter").drop();
    const collection = await mongoClient
      .db("digital-tr")
      .createCollection("qouter");

    const updateResult = await collection.insertMany(data);
    if (!updateResult.acknowledged) {
      await mongoClient.close();
      res.end(500);
      return;
    }
  } catch (e) {
    console.log(e);
    res.end(500);
    await mongoClient.close();
    return;
  }

  res.status(200).end();
  return;
}
