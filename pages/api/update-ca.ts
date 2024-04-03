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

  if (!req.headers.authorization || req.headers.authorization != process.env.NEXT_PUBLIC_API){
    res.status(401).end()
    return
  }
  const data = req.body;
  const mongoClient = await clientPromise
  await mongoClient.connect()

  try{
    switch(req.method){
      case "POST": {
        const updateResult = await mongoClient.db("digital-tr").collection("ca").insertMany(data)
        if(!updateResult.acknowledged){
          await mongoClient.close()
          res.end(500)
          return
        }
        res.status(200).end();
        return
      }
      case "DELETE": {
        await mongoClient.db("digital-tr").collection("ca").drop()
        await mongoClient.db("digital-tr").createCollection("ca")
        res.status(200).end();
      }
      default: {
        res.status(404).end()
        return
      }
    }
  }
  catch(e){
    console.log(e)
    res.end(500)
    await mongoClient.close()
    return
  }

}

