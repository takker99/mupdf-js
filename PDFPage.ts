import type { ColorSpace } from "./ColorSpace.ts";
import { ENUM } from "./enum.ts";
import { fromMatrix, MATRIX, type Matrix } from "./Matrix.ts";
import { libmupdf } from "./module.ts";
import { BOXES, Page, type PageBox } from "./page.ts";
import { PDFAnnotation, type PDFAnnotationType } from "./PDFAnnotation.ts";
import type { PDFDocument } from "./PDFDocument.ts";
import { keepPDFObject, type PDFObject } from "./PDFObject.ts";
import { PDFWidget } from "./PDFWedget.ts";
import { Pixmap } from "./Pixmap.ts";
import type { Pointer } from "./Pointer.ts";
import { RECT, type Rect } from "./Rect.ts";
import { makeCharPtr } from "./string.ts";

export class PDFPage extends Page {
  _doc: PDFDocument;
  _annots: PDFAnnotation[] | null;
  _widgets: PDFWidget[] | null;

  // PRIVATE
  constructor(doc: PDFDocument, pointer: Pointer<"any_page">) {
    super(pointer);
    this._doc = doc;
    this._annots = null;
    this._widgets = null;
  }

  getObject(): PDFObject {
    return keepPDFObject(
      this._doc,
      libmupdf._wasm_pdf_page_get_obj(this.pointer),
    );
  }

  getTransform(): Matrix {
    return fromMatrix(libmupdf._wasm_pdf_page_transform(this.pointer));
  }

  setPageBox(box: PageBox, rect: Rect): void {
    const box_ix = BOXES.indexOf(box);
    libmupdf._wasm_pdf_set_page_box(this.pointer, box_ix, RECT(rect));
  }

  override toPixmap(
    matrix: Matrix,
    colorspace: ColorSpace,
    alpha = false,
    showExtras = true,
    usage = "View",
    box: PageBox = "CropBox",
  ): Pixmap {
    const box_ix = BOXES.indexOf(box);
    let result;
    if (showExtras) {
      result = libmupdf._wasm_pdf_new_pixmap_from_page_with_usage(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
        makeCharPtr(usage),
        box_ix,
      );
    } else {
      result = libmupdf._wasm_pdf_new_pixmap_from_page_contents_with_usage(
        this.pointer,
        MATRIX(matrix),
        colorspace.pointer,
        alpha,
        makeCharPtr(usage),
        box_ix,
      );
    }
    return new Pixmap(result);
  }

  getWidgets(): PDFWidget[] {
    if (!this._widgets) {
      this._widgets = [];
      let widget = libmupdf._wasm_pdf_first_widget(this.pointer);
      while (widget) {
        this._widgets.push(
          new PDFWidget(this._doc, libmupdf._wasm_pdf_keep_annot(widget)),
        );
        widget = libmupdf._wasm_pdf_next_widget(widget);
      }
    }
    return this._widgets;
  }

  getAnnotations(): PDFAnnotation[] {
    if (!this._annots) {
      this._annots = [];
      let annot = libmupdf._wasm_pdf_first_annot(this.pointer);
      while (annot) {
        this._annots.push(
          new PDFAnnotation(this._doc, libmupdf._wasm_pdf_keep_annot(annot)),
        );
        annot = libmupdf._wasm_pdf_next_annot(annot);
      }
    }
    return this._annots;
  }

  createAnnotation(type: PDFAnnotationType): PDFAnnotation {
    const type_ix = ENUM<PDFAnnotationType>(type, PDFAnnotation.ANNOT_TYPES);
    const annot = new PDFAnnotation(
      this._doc,
      libmupdf._wasm_pdf_create_annot(this.pointer, type_ix),
    );
    if (this._annots) {
      this._annots.push(annot);
    }
    return annot;
  }

  deleteAnnotation(annot: PDFAnnotation): void {
    libmupdf._wasm_pdf_delete_annot(this.pointer, annot.pointer);
    if (this._annots) {
      const ix = this._annots.indexOf(annot);
      if (ix >= 0) {
        this._annots.splice(ix, 1);
      }
    }
  }

  static readonly REDACT_IMAGE_NONE = 0;
  static readonly REDACT_IMAGE_REMOVE = 1;
  static readonly REDACT_IMAGE_PIXELS = 2;

  applyRedactions(black_boxes = 1, image_method = 2): void {
    libmupdf._wasm_pdf_redact_page(this.pointer, black_boxes, image_method);
  }

  update(): boolean {
    return !!libmupdf._wasm_pdf_update_page(this.pointer);
  }
}
