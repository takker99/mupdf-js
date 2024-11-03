import { Link } from "./link.ts";
import { libmupdf } from "./module.ts";
import { Page } from "./page.ts";
import { PDFDocument } from "./PDFDocument.ts";
import { PDFPage } from "./PDFPage.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, makeCharPtr2, pop, toText } from "./string.ts";

export type LinkDestType =
  | "Fit"
  | "FitB"
  | "FitH"
  | "FitBH"
  | "FitV"
  | "FitBV"
  | "FitR"
  | "XYZ";
const LINK_DEST = [
  "Fit",
  "FitB",
  "FitH",
  "FitBH",
  "FitV",
  "FitBV",
  "FitR",
  "XYZ",
] as const satisfies LinkDestType[];

interface LinkDest {
  type: LinkDestType;
  chapter: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export type DocumentPermission =
  | "print"
  | "copy"
  | "edit"
  | "annotate"
  | "form"
  | "accessibility"
  | "assemble"
  | "print-hq";

export const isPDF = (
  document: Document | PDFDocument,
): document is PDFDocument => document instanceof PDFDocument;

const PERMISSION = {
  "print": "p".charCodeAt(0),
  "copy": "c".charCodeAt(0),
  "edit": "e".charCodeAt(0),
  "annotate": "n".charCodeAt(0),
  "form": "f".charCodeAt(0),
  "accessibility": "y".charCodeAt(0),
  "assemble": "a".charCodeAt(0),
  "print-hq": "h".charCodeAt(0),
} as const satisfies Record<DocumentPermission, number>;

/**
 * MuPDF can open many document types (PDF, XPS, CBZ, EPUB, FB2 and a handful of image formats).
 */
export class Document implements Disposable, Iterable<Page | PDFPage> {
  [Symbol.dispose](): void {
    libmupdf._wasm_drop_document(this.pointer);
  }
  protected constructor(public pointer: Pointer<"any_document">) {}

  formatLinkURI(dest: LinkDest): string {
    return pop(
      libmupdf._wasm_format_link_uri(
        this.pointer,
        dest.chapter | 0,
        dest.page | 0,
        LINK_DEST.indexOf(dest.type),
        +dest.x,
        +dest.y,
        +dest.width,
        +dest.height,
        +dest.zoom,
      ),
    );
  }

  needsPassword(): boolean {
    return !!libmupdf._wasm_needs_password(this.pointer);
  }

  authenticatePassword(password: string): number {
    return libmupdf._wasm_authenticate_password(
      this.pointer,
      makeCharPtr(password),
    );
  }

  hasPermission(perm: DocumentPermission): boolean {
    const perm_ix = PERMISSION[perm];
    return !!libmupdf._wasm_has_permission(this.pointer, perm_ix);
  }

  getMetaData(key: string): string | undefined {
    const value = libmupdf._wasm_lookup_metadata(
      this.pointer,
      makeCharPtr(key),
    );
    if (value) {
      return toText(value);
    }
    return undefined;
  }

  setMetaData(key: string, value: string): void {
    libmupdf._wasm_set_metadata(
      this.pointer,
      makeCharPtr(key),
      makeCharPtr2(value),
    );
  }

  get count(): number {
    return libmupdf._wasm_count_pages(this.pointer);
  }

  isReflowable(): boolean {
    return libmupdf._wasm_is_document_reflowable(this.pointer);
  }

  layout(w: number, h: number, em: number): void {
    libmupdf._wasm_layout_document(this.pointer, w, h, em);
  }

  loadPage(index: number): Page | PDFPage {
    const pagePtr = libmupdf._wasm_load_page(this.pointer, index);
    if (this instanceof PDFDocument) {
      const pdfPtr = libmupdf._wasm_pdf_page_from_fz_page(pagePtr);
      if (pdfPtr) {
        return new PDFPage(this, pdfPtr);
      }
    }
    return new Page(pagePtr);
  }

  [Symbol.iterator](): Iterator<Page | PDFPage> {
    let index = 0;
    return {
      next: () => {
        if (index < this.count) {
          return { value: this.loadPage(index++), done: false };
        }
        return { value: null, done: true };
      },
    };
  }

  resolveLink(link: string | Link): number {
    if (link instanceof Link) {
      return libmupdf._wasm_resolve_link(
        this.pointer,
        libmupdf._wasm_link_get_uri(link.pointer),
      );
    }
    return libmupdf._wasm_resolve_link(this.pointer, makeCharPtr(link));
  }

  resolveLinkDestination(link: string | Link): LinkDest {
    let dest: Pointer<"fz_link_dest">;
    if (link instanceof Link) {
      dest = libmupdf._wasm_resolve_link_dest(
        this.pointer,
        libmupdf._wasm_link_get_uri(link.pointer),
      );
    } else {
      dest = libmupdf._wasm_resolve_link_dest(this.pointer, makeCharPtr(link));
    }
    return {
      type: LINK_DEST[libmupdf._wasm_link_dest_get_type(dest)],
      chapter: libmupdf._wasm_link_dest_get_chapter(dest),
      page: libmupdf._wasm_link_dest_get_page(dest),
      x: libmupdf._wasm_link_dest_get_x(dest),
      y: libmupdf._wasm_link_dest_get_y(dest),
      width: libmupdf._wasm_link_dest_get_w(dest),
      height: libmupdf._wasm_link_dest_get_h(dest),
      zoom: libmupdf._wasm_link_dest_get_zoom(dest),
    };
  }
}
