import { libmupdf } from "./module.ts";
import type { PDFDocument } from "./PDFDocument.ts";
import { makePDFObject, type PDFObject } from "./PDFObject.ts";
import type { Pointer } from "./Pointer.ts";

export class PDFGraftMap implements Disposable {
  [Symbol.dispose](): void {
    libmupdf._wasm_pdf_drop_graft_map(this.pointer);
  }

  static create(document: PDFDocument): PDFGraftMap {
    return new PDFGraftMap(
      document,
      libmupdf._wasm_pdf_new_graft_map(document.pointer),
    );
  }

  #doc: PDFDocument;

  private constructor(doc: PDFDocument, public pointer: Pointer<"pdf_graft_map">) {
    this.#doc = doc;
  }

  graftObject(obj: PDFObject): PDFObject {
    return makePDFObject(
      this.#doc,
      libmupdf._wasm_pdf_graft_mapped_object(this.pointer, obj.pointer),
    );
  }

  graftPage(to: number, srcDoc: PDFDocument, srcPage: number): void {
    libmupdf._wasm_pdf_graft_mapped_page(
      this.pointer,
      to,
      srcDoc.pointer,
      srcPage,
    );
  }
}
