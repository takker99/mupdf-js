import { Document } from "./mod.ts";

const pdfPath = "sample.pdf";
const pdfData = await Deno.readFile(pdfPath);
const pdfDocument = Document.openDocument(pdfData, "application/pdf");
const index = pdfDocument.countPages();
for (let i = 0; i < index; i++) {
  const page = pdfDocument.loadPage(i);
  const text = page.toStructuredText();
  console.log(text.asText());
}