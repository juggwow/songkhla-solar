import clientPromise from "@/lib/mongodb";
import { CA, TableCA } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    cas : CA[]
    count : number
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
){
    if(req.method != "POST"){
        res.status(404).end()
        return
    }
    const {searchCA,tableCA}:{searchCA:CA,tableCA:TableCA} = req.body;
      const mongoClient = await clientPromise
      await mongoClient.connect()

      try{
        const aggregateSearch = [
            {
                $match: {
                    ca: { $ne: "",$regex:searchCA.ca },
                    name: { $ne: "",$regex:searchCA.name },
                    address: {$regex:searchCA.address}
                  }
            },{
                $project:
                  {
                    _id: 0,
                    ca: 1,
                    name: 1,
                    address: 1,
                  },
              },{
                $skip:
                  tableCA.page*tableCA.rowsPerPage,
              },
              {
                $limit:
                  tableCA.rowsPerPage,
              },
        ]
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
              },
            },
            {
              $count:
                "count",
            },
          ]
        const cas = await mongoClient.db("digital-tr").collection("ca").aggregate(aggregateSearch).toArray()
        const count = await mongoClient.db("digital-tr").collection("ca").aggregate(aggregateCount).toArray()
        const data = {cas:cas as unknown as CA[],count: count.length == 0?0:count[0] as unknown as number}
        console.log(data)
        res.send({cas:cas as unknown as CA[],count: count.length == 0?0:count[0] as unknown as number})

      }catch(e){
        await mongoClient.close()
        console.log(e)
        res.status(500).end()
      }
    res.status(200).end()
    return
}