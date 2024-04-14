import { PDFDocument, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs';

export async function createPDF() {
    // อ่านไฟล์ฟอนต์ THSarabunNew จาก public/fonts
    const fontBytes = fs.readFileSync('public/fonts/THSarabunNew.ttf');

    // สร้างเอกสาร PDF ใหม่
    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontkit)
    const customFont = await pdfDoc.embedFont(fontBytes)

    const page = pdfDoc.addPage();

    // เพิ่มข้อความโดยใช้ฟอนต์ THSarabunNew
    const { width, height } = page.getSize();
    const fontSize = 30;
    const text = 'สวัสดี, ฉันใช้ฟอนต์ THSarabunNew!';
    
    page.drawText(text, {
        x: 50,
        y: height - 100,
        size: fontSize,
        font: customFont,
    });

    // บันทึกเอกสาร PDF เป็นไฟล์
    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes)
    const pdfBase64 = buffer.toString('base64');
    return pdfBase64
}
