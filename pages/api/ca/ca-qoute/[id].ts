import clientPromise from "@/lib/mongodb";
import { CA, CAQoute, TableCA } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

type Data =
  | {
      id: string;
    }
  | CAQoute[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | CAQoute>,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }

  const { id } = req.query;
  if (typeof id != "string") {
    res.status(404).end();
    return;
  }

  const mongoClient = await clientPromise;
  await mongoClient.connect();
  const collection = mongoClient.db("digital-tr").collection("ca-qoute");

  try {
    switch (req.method) {
      case "GET": {
        const resultFindCAQoute = await mongoClient
          .db("digital-tr")
          .collection("find-ca-qoute")
          .findOne(
            { _id: id as unknown as ObjectId },
            {
              projection: {
                _id: 0,
                qoutes: 1,
              },
            },
          );
        if (!resultFindCAQoute) {
          await mongoClient.close();
          res.status(404).end();
          return;
        }

        await mongoClient.close();
        res.send(resultFindCAQoute["qoutes"] as unknown as CAQoute[]);
        return;
      }
      case "PATCH": {
        const update = req.body;
        const resultUpdate = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: update },
        );
        if (!resultUpdate.acknowledged) {
          await mongoClient.close();
          res.status(404).end();
          return;
        }

        res.status(200).end();
        return;
      }
      case "DELETE": {
        const resulteDel = await collection.deleteOne({
          _id: new ObjectId(id),
        });
        if (!resulteDel.acknowledged) {
          await mongoClient.close();
          res.status(500).end();
          return;
        }

        await mongoClient.close();
        res.status(200).end();
        return;
      }
      default: {
        await mongoClient.close();
        res.status(404).end();
        return;
      }
    }
  } catch (e) {
    await mongoClient.close();
    console.log(e);
    res.status(500).end();
  }
}
