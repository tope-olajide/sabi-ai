import { NextResponse } from "next/server";
import fs from "fs";
import { NextApiResponse } from "next";
import { PDFExtract, PDFExtractOptions } from "pdf.js-extract";

export async function POST(req: Request, res: NextApiResponse) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json({
      success: false,
      message: "File not found",
    });
  }
  const mimeType = file.type;
  try {
    /*       const fileExtension = mimeType.split("/")[1];*/
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync("./public/file.pdf", buffer);
    const dataBuffer = fs.readFileSync("./public/file.pdf");
    const pdfExtract = new PDFExtract();
    const options: PDFExtractOptions = {};
    
    const data = await pdfExtract.extract("./public/file.pdf", options);
    const allStrData = [];
    for (const page of data.pages) {
      for (const content of page.content) {
        if (content.str) {
          allStrData.push(content.str);
        }
      }
    } 
    const joinedStrData = allStrData.join(" ");
    console.log(joinedStrData);
        return NextResponse.json({
          success: true,
          message: "Data Extracted Successfully",
          data: joinedStrData
        });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "error: 'Error while extracting text from PDF.'",
    });
  }
}
