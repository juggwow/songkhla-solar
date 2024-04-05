import clientPromise from "@/lib/mongodb";
import { CA, CAQoute, TableCA } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const mongoClient = await clientPromise;
  await mongoClient.connect();

  try {
    switch (req.method) {
      case "POST": {
        const { ca }: { ca: string } = req.body;
        const resultFindCA = await mongoClient
          .db("digital-tr")
          .collection("ca")
          .findOne(
            { ca },
            {
              projection: {
                _id: 0,
                ca: 1,
                name: 1,
                address: 1,
              },
            },
          );
        if (!resultFindCA) {
          await mongoClient.close();
          res.status(404).end();
          return;
        }

        const caQoute = {
          customer: resultFindCA as unknown as CA,
          package: [],
          transformer: [],
          accessory: [],
        };

        const resultInsert = await mongoClient
          .db("digital-tr")
          .collection("ca-qoute")
          .insertOne(caQoute);
        if (!resultInsert.acknowledged) {
          await mongoClient.close();
          res.status(500).end();
          return;
        }
        res.send({ id: resultInsert.insertedId.toHexString() });
        return;
      }
    }
  } catch (e) {
    await mongoClient.close();
    console.log(e);
    res.status(500).end();
  }
}
