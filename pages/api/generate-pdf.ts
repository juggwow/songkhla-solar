import { generateConfirmationPDF } from "@/lib/create-pdf";
import clientPromise from "@/lib/mongodb";
import { CAQoute } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  file: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const base64 = await generateConfirmationPDF(req.body as CAQoute);
    res.send({ file: base64 });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).end();
    return;
  }
}
