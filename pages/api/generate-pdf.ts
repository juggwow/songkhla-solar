import { createPDF } from "@/lib/create-pdf";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  file: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
){
    try{
        const base64 = await createPDF()
        res.send({file: base64})
    return 
    }catch(e){
        console.log(e)
        res.status(500).end()
        return
    }
}