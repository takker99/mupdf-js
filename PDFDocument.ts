import { type AnyBuffer, Buffer, makeBufferPtr } from "./buffer.ts";
import { Document } from "./document.ts";
import {
  CJK_ORDERING_BY_LANG,
  type Font,
  type FontCJKLanguage,
  type FontCJKOrdering,
  type FontSimpleEncoding,
  SIMPLE_ENCODING,
} from "./font.ts";
import { Image } from "./image.ts";
import { free, malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import {
  keepPDFObject,
  makePDFArrayObject,
  makePDFDictionaryObject,
  makePDFObject,
  makePDFStringObject,
  PDFObject,
  type PDFObjectLike,
  toPDFObject,
} from "./PDFObject.ts";
import type { PDFPage } from "./PDFPage.ts";
import type { Pointer } from "./Pointer.ts";
import { RECT, type Rect } from "./Rect.ts";
import type { Stream } from "./stream.ts";
import { makeCharPtr, makeCharPtr2, toText } from "./string.ts";

export type Rotate = 0 | 90 | 180 | 270;

export const PAGE_LABEL_NONE = "\0";
export const PAGE_LABEL_DECIMAL = "D";
export const PAGE_LABEL_ROMAN_UC = "R";
export const PAGE_LABEL_ROMAN_LC = "r";
export const PAGE_LABEL_ALPHA_UC = "A";
export const PAGE_LABEL_ALPHA_LC = "a";

export class PDFDocument extends Document {
  /**
   * Open a document from a buffer or stream.
   *
   * @param data
   * @param mimeType
   * @returns
   */
  static openDocument(
    data: Buffer | ArrayBuffer | Uint8Array | Stream,
    mimeType: string,
  ): PDFDocument | Document {
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      data = new Buffer(data);
    }
    let pointer = 0 as Pointer<"any_document">;
    if (data instanceof Buffer) {
      pointer = libmupdf._wasm_open_document_with_buffer(
        makeCharPtr(mimeType),
        data.pointer,
      );
    } else {
      pointer = libmupdf._wasm_open_document_with_stream(
        makeCharPtr(mimeType),
        data.pointer,
      );
    }

    const pdf = libmupdf._wasm_pdf_document_from_fz_document(pointer);
    if (pdf) {
      return new PDFDocument(pdf);
    }

    return new Document(pointer);
  }

  // Create a new empty document
  private constructor();

  // Open an existing document
  private constructor(data: Buffer | ArrayBuffer | Uint8Array);

  // PRIVATE
  private constructor(pointer: Pointer<"any_document">);

  // deno-lint-ignore constructor-super
  private constructor(
    arg1?: Pointer<"any_document"> | Buffer | ArrayBuffer | Uint8Array,
  ) {
    if (typeof arg1 === "undefined") {
      super(libmupdf._wasm_pdf_create_document());
    } else if (typeof arg1 === "number") {
      super(arg1);
    } else {
      const doc = PDFDocument.openDocument(arg1, "application/pdf");
      if (doc instanceof PDFDocument) {
        return doc;
      }
      throw new Error("not a PDF document");
    }
  }

  override loadPage(index: number): PDFPage {
    return super.loadPage(index) as PDFPage;
  }

  _PDFOBJ(obj: PDFObjectLike): Pointer<"pdf_obj"> {
    // Note: We have to create a PDFObject instance for garbage collection.
    return toPDFObject(this, obj).pointer;
  }

  getVersion(): number {
    return libmupdf._wasm_pdf_version(this.pointer);
  }

  getLanguage(): string {
    return toText(libmupdf._wasm_pdf_document_language(this.pointer));
  }

  setLanguage(lang: string): void {
    libmupdf._wasm_pdf_set_document_language(this.pointer, makeCharPtr(lang));
  }

  countObjects(): number {
    return libmupdf._wasm_pdf_xref_len(this.pointer);
  }

  getTrailer(): PDFObject {
    return new PDFObject(this, libmupdf._wasm_pdf_trailer(this.pointer));
  }

  deleteObject(num: number | PDFObject): void {
    if (num instanceof PDFObject) {
      num = num.asIndirect();
    }
    libmupdf._wasm_pdf_delete_object(this.pointer, num);
  }

  addObject(obj: PDFObjectLike): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_object(this.pointer, this._PDFOBJ(obj)),
    );
  }

  addStream(buf: AnyBuffer, obj: PDFObjectLike): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_stream(
        this.pointer,
        makeBufferPtr(buf),
        this._PDFOBJ(obj),
        0,
      ),
    );
  }

  addRawStream(buf: AnyBuffer, obj: PDFObjectLike): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_stream(
        this.pointer,
        makeBufferPtr(buf),
        this._PDFOBJ(obj),
        1,
      ),
    );
  }

  graftPage(to: number, srcDoc: PDFDocument, srcPage: number): void {
    libmupdf._wasm_pdf_graft_page(this.pointer, to, srcDoc.pointer, srcPage);
  }

  addSimpleFont(font: Font, encoding: FontSimpleEncoding = "Latin"): PDFObject {
    const encoding_ix = SIMPLE_ENCODING.indexOf(encoding);
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_simple_font(
        this.pointer,
        font.pointer,
        encoding_ix,
      ),
    );
  }

  addCJKFont(
    font: Font,
    lang: FontCJKOrdering | FontCJKLanguage,
    wmode = 0,
    serif = true,
  ): PDFObject {
    if (typeof lang === "string") {
      lang = CJK_ORDERING_BY_LANG[lang];
    }
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_cjk_font(
        this.pointer,
        font.pointer,
        lang,
        wmode,
        serif,
      ),
    );
  }

  addFont(font: Font): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_cid_font(this.pointer, font.pointer),
    );
  }

  addImage(image: Image): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_image(this.pointer, image.pointer),
    );
  }

  findPage(index: number): PDFObject {
    return keepPDFObject(
      this,
      libmupdf._wasm_pdf_lookup_page_obj(this.pointer, index),
    );
  }

  addPage(
    mediabox: Rect,
    rotate: Rotate,
    resources: PDFObjectLike,
    contents: AnyBuffer,
  ): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_page(
        this.pointer,
        RECT(mediabox),
        rotate,
        this._PDFOBJ(resources),
        makeBufferPtr(contents),
      ),
    );
  }

  insertPage(at: number, obj: PDFObject): void {
    libmupdf._wasm_pdf_insert_page(this.pointer, at, this._PDFOBJ(obj));
  }

  deletePage(at: number): void {
    libmupdf._wasm_pdf_delete_page(this.pointer, at);
  }

  isEmbeddedFile(ref: PDFObject): number {
    return libmupdf._wasm_pdf_is_embedded_file(ref.pointer);
  }

  addEmbeddedFile(
    filename: string,
    mimetype: string,
    contents: AnyBuffer,
    created: Date,
    modified: Date,
    checksum = false,
  ): PDFObject {
    return makePDFObject(
      this,
      libmupdf._wasm_pdf_add_embedded_file(
        this.pointer,
        makeCharPtr(filename),
        makeCharPtr2(mimetype),
        makeBufferPtr(contents),
        created.getTime() / 1000 | 0,
        modified.getTime() / 1000 | 0,
        checksum,
      ),
    );
  }

  getEmbeddedFileParams(ref: PDFObject): {
    filename: string;
    mimetype: string;
    size: Pointer<"char">;
    creationDate: Date;
    modificationDate: Date;
  } {
    const ptr = libmupdf._wasm_pdf_get_embedded_file_params(ref.pointer);
    return {
      filename: toText(
        libmupdf._wasm_pdf_embedded_file_params_get_filename(ptr),
      ),
      mimetype: toText(
        libmupdf._wasm_pdf_embedded_file_params_get_mimetype(ptr),
      ),
      size: libmupdf._wasm_pdf_embedded_file_params_get_filename(ptr),
      creationDate: new Date(
        libmupdf._wasm_pdf_embedded_file_params_get_created(ptr) * 1000,
      ),
      modificationDate: new Date(
        libmupdf._wasm_pdf_embedded_file_params_get_modified(ptr) * 1000,
      ),
    };
  }

  getEmbeddedFileContents(ref: PDFObject): Buffer | null {
    const contents = libmupdf._wasm_pdf_load_embedded_file_contents(
      ref.pointer,
    );
    if (contents) {
      return new Buffer(contents);
    }
    return null;
  }

  getEmbeddedFiles(): Record<string, PDFObject> {
    function _getEmbeddedFilesRec(
      result: Record<string, PDFObject>,
      N: PDFObject,
    ) {
      let i, n;
      if (N.isDictionary()) {
        const NN = N.get("Names");
        if (NN) {
          for (i = 0, n = NN.length; i < n; i += 2) {
            result[NN.get(i + 0).asString()] = NN.get(i + 1);
          }
        }
        const NK = N.get("Kids");
        if (NK) {
          for (i = 0, n = NK.length; i < n; i += 1) {
            _getEmbeddedFilesRec(result, NK.get(i));
          }
        }
      }
      return result;
    }
    return _getEmbeddedFilesRec(
      {},
      this.getTrailer().get("Root", "Names", "EmbeddedFiles"),
    );
  }

  insertEmbeddedFile(filename: string, filespec: PDFObject): void {
    const efs = this.getEmbeddedFiles();
    efs[filename] = filespec;
    this._rewriteEmbeddedFiles(efs);
  }

  deleteEmbeddedFile(filename: string): void {
    const efs = this.getEmbeddedFiles();
    delete efs[filename];
    this._rewriteEmbeddedFiles(efs);
  }

  _rewriteEmbeddedFiles(efs: Record<string, PDFObject>): void {
    const efs_keys = Object.keys(efs);
    efs_keys.sort();
    const root = this.getTrailer().get("Root");
    let root_names = root.get("Names");
    if (!root_names.isDictionary()) {
      root_names = root.put(
        "Names",
        makePDFDictionaryObject(this, 1),
      ) as PDFObject;
    }
    const root_names_efs = root_names.put(
      "EmbeddedFiles",
      makePDFDictionaryObject(this, 1),
    );
    const root_names_efs_names = root_names_efs.put(
      "Names",
      makePDFArrayObject(this, efs_keys.length * 2),
    );
    for (const key of efs_keys) {
      root_names_efs_names.push(makePDFStringObject(this, key));
      root_names_efs_names.push(efs[key]);
    }
  }

  saveToBuffer(options = ""): Buffer {
    // TODO: object options to string options?
    return new Buffer(
      libmupdf._wasm_pdf_write_document_buffer(
        this.pointer,
        makeCharPtr(options),
      ),
    );
  }

  setPageLabels(index: number, style = "D", prefix = "", start = 1): void {
    libmupdf._wasm_pdf_set_page_labels(
      this.pointer,
      index,
      style.charCodeAt(0),
      makeCharPtr(prefix),
      start,
    );
  }

  deletePageLabels(index: number): void {
    libmupdf._wasm_pdf_delete_page_labels(this.pointer, index);
  }

  wasRepaired(): boolean {
    return !!libmupdf._wasm_pdf_was_repaired(this.pointer);
  }

  hasUnsavedChanges(): boolean {
    return !!libmupdf._wasm_pdf_has_unsaved_changes(this.pointer);
  }

  countVersions(): number {
    return libmupdf._wasm_pdf_count_versions(this.pointer);
  }

  countUnsavedVersions(): number {
    return libmupdf._wasm_pdf_count_unsaved_versions(this.pointer);
  }

  validateChangeHistory(): number {
    return libmupdf._wasm_pdf_validate_change_history(this.pointer);
  }

  canBeSavedIncrementally(): boolean {
    return !!libmupdf._wasm_pdf_can_be_saved_incrementally(this.pointer);
  }

  enableJournal(): void {
    libmupdf._wasm_pdf_enable_journal(this.pointer);
  }

  getJournal(): {
    position: number;
    steps: string[];
  } {
    const position = libmupdf._wasm_pdf_undoredo_state_position(this.pointer);
    const n = libmupdf._wasm_pdf_undoredo_state_count(this.pointer);
    const steps: string[] = [];
    for (let i = 0; i < n; ++i) {
      steps.push(
        toText(
          libmupdf._wasm_pdf_undoredo_step(this.pointer, i),
        ),
      );
    }
    return { position, steps };
  }

  beginOperation(op: string): void {
    libmupdf._wasm_pdf_begin_operation(this.pointer, makeCharPtr(op));
  }

  beginImplicitOperation(): void {
    libmupdf._wasm_pdf_begin_implicit_operation(this.pointer);
  }

  endOperation(): void {
    libmupdf._wasm_pdf_end_operation(this.pointer);
  }

  abandonOperation(): void {
    libmupdf._wasm_pdf_abandon_operation(this.pointer);
  }

  canUndo(): boolean {
    return !!libmupdf._wasm_pdf_can_undo(this.pointer);
  }

  canRedo(): boolean {
    return !!libmupdf._wasm_pdf_can_redo(this.pointer);
  }

  undo(): void {
    libmupdf._wasm_pdf_undo(this.pointer);
  }

  redo(): void {
    libmupdf._wasm_pdf_redo(this.pointer);
  }

  isJSSupported(): boolean {
    return !!libmupdf._wasm_pdf_js_supported(this.pointer);
  }

  enableJS(): void {
    libmupdf._wasm_pdf_enable_js(this.pointer);
  }

  disableJS(): void {
    libmupdf._wasm_pdf_disable_js(this.pointer);
  }

  setJSEventListener(_listener: unknown): never {
    throw "TODO";
  }

  rearrangePages(pages: number[]): void {
    const n = pages.length;
    const ptr = malloc<"int">(n << 2);
    for (let i = 0; i < n; ++i) {
      libmupdf.HEAPU32[(ptr >> 2) + i] = pages[i] || 0;
    }
    try {
      libmupdf._wasm_pdf_rearrange_pages(this.pointer, n, ptr);
    } finally {
      free(ptr);
    }
  }

  bake(bakeAnnots = true, bakeWidgets = true): void {
    libmupdf._wasm_pdf_bake_document(this.pointer, bakeAnnots, bakeWidgets);
  }
}

export const loadImage = (document: PDFDocument, ref: PDFObject): Image =>
  new Image(libmupdf._wasm_pdf_load_image(document.pointer, ref.pointer));
