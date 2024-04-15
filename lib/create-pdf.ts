import { PDFDocument, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";
import { CAQoute } from "@/type/ca";

export async function generateConfirmationPDF(caQoute: CAQoute) {
  const mockBusiness = "บริษัท ร่ำรวยเงินทอง ไหลมาเทมา จำกัด";
  const fontPath = path.join(process.cwd(), "public/fonts/THSarabunNew.ttf");
  // อ่านไฟล์ฟอนต์ THSarabunNew จาก public/fonts
  const fontBytes = fs.readFileSync(fontPath);

  // สร้างเอกสาร PDF ใหม่
  const pdfDoc = await PDFDocument.create();

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage();

  // เพิ่มข้อความโดยใช้ฟอนต์ THSarabunNew
  const { width, height } = page.getSize();
  const maxWidth = (width / 210) * 180;
  const x = (width / 210) * 15;
  const spaceY = (height / 297) * 15;
  const fontSize = 16;
  const heightFont16 = customFont.heightAtSize(16);
  const nameAddressBusiness =
    `\t\t ข้าพเจ้า ${caQoute.customer.name} ${mockBusiness} ที่อยู่ ${caQoute.customer.address}` +
    `มีความประสงค์ให้การไฟฟ้าส่วนภูมภาคสาขาเมืองสงขลา จัดส่งเจ้าหน้าที่ดำเนินการดังนี้ `;
  const nameAddressBusinessHeiht =
    heightFont16 *
    Math.ceil(customFont.widthOfTextAtSize(nameAddressBusiness, 16) / maxWidth);

  page.drawText(nameAddressBusiness, {
    maxWidth,
    x,
    y: (height / 297) * (297 - 15),
    size: fontSize,
    font: customFont,
  });

  page.drawText(nameAddressBusiness, {
    maxWidth,
    x,
    y: height - nameAddressBusinessHeiht - 8 - spaceY,
    size: fontSize,
    font: customFont,
  });

  // บันทึกเอกสาร PDF เป็นไฟล์
  const pdfBytes = await pdfDoc.save();
  const buffer = Buffer.from(pdfBytes);
  const pdfBase64 = buffer.toString("base64");
  return pdfBase64;
}
