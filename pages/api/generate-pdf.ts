import { generateConfirmationPDF } from "@/lib/create-pdf";
import clientPromise from "@/lib/mongodb";
import { CAQoute } from "@/type/ca";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method != "POST") {
      res.status(404).end();
      return;
    }
    const resultAppScript = await fetch(
      "https://script.google.com/macros/s/AKfycbyBoN5ygzqqkcGqCUsKIna5onxqLXW-Yb0Wm1MaRkdSLGtok0nCH_lqRyCRCP4dQKk1/exec",
      {
        method: "POST",
        body: JSON.stringify({
          test: "test",
        }),
      },
    );
    res.send(await resultAppScript.json());
    return;
  } catch (e) {
    console.log(e);
    res.status(500).end();
    return;
  }
}
