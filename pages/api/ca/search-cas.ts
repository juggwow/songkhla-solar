import clientPromise from "@/lib/mongodb";
import { CA, CAWithQouteCount, SearchCA, TableCA } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  cas: CAWithQouteCount[];
  count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).end();
    return;
  }

  if (req.method != "POST") {
    res.status(404).end();
    return;
  }
  const { searchCA, tableCA }: { searchCA: SearchCA; tableCA: TableCA } =
    req.body;
  const mongoClient = await clientPromise;
  await mongoClient.connect();

  try {
    const aggregateSearch = [
      {
        $match: {
          ca: { $ne: "", $regex: searchCA.ca },
          name: { $ne: "", $regex: searchCA.name },
          address: { $regex: searchCA.address },
          meter: { $regex: searchCA.meter },
        },
      },
      {
        $project: {
          _id: 0,
          ca: 1,
          name: 1,
          address: 1,
          quoteCount: 1,
          meter: 1,
        },
      },
      {
        $skip: tableCA.page * tableCA.rowsPerPage,
      },
      {
        $limit: tableCA.rowsPerPage,
      },
    ];
    const aggregateCount = [
      {
        $match: {
          ca: {
            $ne: "",
            $regex: searchCA.ca,
          },
          name: {
            $ne: "",
            $regex: searchCA.name,
          },
          address: {
            $regex: searchCA.address,
          },
          meter: { $regex: searchCA.meter },
        },
      },
      {
        $count: "count",
      },
    ];
    const cas = await mongoClient
      .db("digital-tr")
      .collection("ca-with-qoute-count")
      .aggregate(aggregateSearch)
      .toArray();
    const count = await mongoClient
      .db("digital-tr")
      .collection("ca-with-qoute-count")
      .aggregate(aggregateCount)
      .toArray();
    res.send({
      cas: cas as unknown as CAWithQouteCount[],
      count: count.length == 0 ? 0 : (count[0] as unknown as number),
    });
  } catch (e) {
    await mongoClient.close();
    console.log(e);
    res.status(500).end();
  }
  res.status(200).end();
  return;
}
