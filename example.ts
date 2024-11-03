import { PDFDocument } from "./mod.ts";

const pdfPath = "sample.pdf";
const pdfData = await Deno.readFile(pdfPath);
const pdfDocument = PDFDocument.openDocument(pdfData, "application/pdf");
for (const page of pdfDocument) {
  const text = page.toStructuredText();
  console.log(text.asText());
}
