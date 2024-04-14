import { Button } from "@mui/material";

import { useState } from "react";

// Create Document Component
export default function BasicDocument() {
  const handleClick = async()=>{
    const res = await fetch("/api/generate-pdf")
    if(res.status!=200){
      console.log("error")
      return
    }
    // สร้าง URL สำหรับดาวน์โหลด PDF
    const {file} = await res.json()
    const pdfBlob = Buffer.from(file as string, 'base64');
    const pdfUrl = URL.createObjectURL(new Blob([pdfBlob]));

    // สร้างลิงก์สำหรับดาวน์โหลด PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'generated_pdf.pdf';
    downloadLink.click();
  }
  
  return (
    <div>
      <Button onClick={() => handleClick()}>เปิดสิ!!</Button>
    </div>
  );
}
