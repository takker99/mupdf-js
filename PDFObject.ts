import { type AnyBuffer, Buffer, makeBufferPtr } from "./buffer.ts";
import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { PDFDocument } from "./PDFDocument.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, pop, toText } from "./string.ts";
import { Userdata } from "./Userdata.ts";

export type PDFObjectPath = Array<number | string | PDFObject>;

export type PDFObjectLike =
  | PDFObject
  | null
  | undefined
  | string
  | number
  | boolean
  | PDFObjectLike[]
  | { [key: string]: PDFObjectLike };

const _wasm_int = /* @__PURE__ */ malloc<"int">(4);

export class PDFObject extends Userdata<"pdf_obj"> {
  static override readonly _drop: (p: Pointer<"pdf_obj">) => void =
    libmupdf._wasm_pdf_drop_obj;

  #doc: PDFDocument;

  // PRIVATE
  constructor(doc: PDFDocument, pointer: Pointer<"pdf_obj">) {
    super(libmupdf._wasm_pdf_keep_obj(pointer));
    this.#doc = doc;
  }

  isNull(): boolean {
    return this === Null;
  }
  isIndirect(): boolean {
    return !!libmupdf._wasm_pdf_is_indirect(this.pointer);
  }
  isBoolean(): boolean {
    return !!libmupdf._wasm_pdf_is_bool(this.pointer);
  }
  isInteger(): boolean {
    return !!libmupdf._wasm_pdf_is_int(this.pointer);
  }
  isNumber(): boolean {
    return !!libmupdf._wasm_pdf_is_number(this.pointer);
  }
  isName(): boolean {
    return !!libmupdf._wasm_pdf_is_name(this.pointer);
  }
  isString(): boolean {
    return !!libmupdf._wasm_pdf_is_string(this.pointer);
  }
  isArray(): boolean {
    return !!libmupdf._wasm_pdf_is_array(this.pointer);
  }
  isDictionary(): boolean {
    return !!libmupdf._wasm_pdf_is_dict(this.pointer);
  }
  isStream(): boolean {
    return !!libmupdf._wasm_pdf_is_stream(this.pointer);
  }

  asIndirect(): number {
    return libmupdf._wasm_pdf_to_num(this.pointer);
  }
  asBoolean(): boolean {
    return !!libmupdf._wasm_pdf_to_bool(this.pointer);
  }
  asNumber(): number {
    return libmupdf._wasm_pdf_to_real(this.pointer);
  }
  asName(): string {
    return toText(libmupdf._wasm_pdf_to_name(this.pointer));
  }
  asString(): string {
    return toText(libmupdf._wasm_pdf_to_text_string(this.pointer));
  }

  asByteString(): Uint8Array {
    const ptr = libmupdf._wasm_pdf_to_string(this.pointer, _wasm_int);
    const len = libmupdf.HEAPU32[_wasm_int >> 2] as number;
    return libmupdf.HEAPU8.slice(ptr, ptr + len);
  }

  readStream(): Buffer {
    return new Buffer(libmupdf._wasm_pdf_load_stream(this.pointer));
  }
  readRawStream(): Buffer {
    return new Buffer(libmupdf._wasm_pdf_load_raw_stream(this.pointer));
  }

  writeObject(obj: PDFObjectLike): void {
    if (!this.isIndirect()) {
      throw new TypeError(
        "can only call PDFObject.writeObject on an indirect reference",
      );
    }
    libmupdf._wasm_pdf_update_object(
      this.#doc.pointer,
      this.asIndirect(),
      this.#doc._PDFOBJ(obj),
    );
  }

  writeStream(buf: AnyBuffer): void {
    if (!this.isIndirect()) {
      throw new TypeError(
        "can only call PDFObject.writeStream on an indirect reference",
      );
    }
    libmupdf._wasm_pdf_update_stream(
      this.#doc.pointer,
      this.pointer,
      makeBufferPtr(buf),
      0,
    );
  }

  writeRawStream(buf: AnyBuffer): void {
    if (!this.isIndirect()) {
      throw new TypeError(
        "can only call PDFObject.writeRawStream on an indirect reference",
      );
    }
    libmupdf._wasm_pdf_update_stream(
      this.#doc.pointer,
      this.pointer,
      makeBufferPtr(buf),
      1,
    );
  }

  resolve(): PDFObject {
    return keepPDFObject(
      this.#doc,
      libmupdf._wasm_pdf_resolve_indirect(this.pointer),
    );
  }

  get length(): number {
    return libmupdf._wasm_pdf_array_len(this.pointer);
  }

  _get(path: PDFObjectPath): Pointer<"pdf_obj"> {
    let obj = this.pointer;
    for (const key of path) {
      if (typeof key === "number") {
        obj = libmupdf._wasm_pdf_array_get(obj, key);
      } else if (key instanceof PDFObject) {
        obj = libmupdf._wasm_pdf_dict_get(obj, key.pointer);
      } else {
        obj = libmupdf._wasm_pdf_dict_gets(obj, makeCharPtr(key));
      }
      if (obj === 0) {
        break;
      }
    }
    return obj;
  }

  get(...path: PDFObjectPath): PDFObject {
    return keepPDFObject(this.#doc, this._get(path));
  }
  getIndirect(...path: PDFObjectPath): number {
    return libmupdf._wasm_pdf_to_num(this._get(path));
  }
  getBoolean(...path: PDFObjectPath): boolean {
    return !!libmupdf._wasm_pdf_to_bool(this._get(path));
  }
  getNumber(...path: PDFObjectPath): number {
    return libmupdf._wasm_pdf_to_real(this._get(path));
  }
  getName(...path: PDFObjectPath): string {
    return toText(libmupdf._wasm_pdf_to_name(this._get(path)));
  }
  getString(...path: PDFObjectPath): string {
    return toText(libmupdf._wasm_pdf_to_text_string(this._get(path)));
  }

  getInheritable(key: string | PDFObject): PDFObject {
    if (key instanceof PDFObject) {
      return keepPDFObject(
        this.#doc,
        libmupdf._wasm_pdf_dict_get_inheritable(this.pointer, key.pointer),
      );
    }
    return keepPDFObject(
      this.#doc,
      libmupdf._wasm_pdf_dict_gets_inheritable(this.pointer, makeCharPtr(key)),
    );
  }

  put(key: number | string | PDFObject, value: PDFObjectLike): PDFObject {
    value = toPDFObject(this.#doc, value);
    if (typeof key === "number") {
      libmupdf._wasm_pdf_array_put(this.pointer, key, value.pointer);
    } else if (key instanceof PDFObject) {
      libmupdf._wasm_pdf_dict_put(this.pointer, key.pointer, value.pointer);
    } else {
      libmupdf._wasm_pdf_dict_puts(
        this.pointer,
        makeCharPtr(key),
        value.pointer,
      );
    }
    return value;
  }

  push(value: PDFObjectLike): PDFObject {
    value = toPDFObject(this.#doc, value);
    libmupdf._wasm_pdf_array_push(this.pointer, value.pointer);
    return value;
  }

  delete(key: number | string | PDFObject): void {
    if (typeof key === "number") {
      libmupdf._wasm_pdf_array_delete(this.pointer, key);
    } else if (key instanceof PDFObject) {
      libmupdf._wasm_pdf_dict_del(this.pointer, key.pointer);
    } else {
      libmupdf._wasm_pdf_dict_dels(this.pointer, makeCharPtr(key));
    }
  }

  override valueOf(): string | number | boolean | this | null {
    if (this.isNull()) return null;
    if (this.isBoolean()) return this.asBoolean();
    if (this.isNumber()) return this.asNumber();
    if (this.isName()) return this.asName();
    if (this.isString()) return this.asString();
    if (this.isIndirect()) return `${this.asIndirect()} 0 R`;
    return this;
  }

  override toString(tight = true, ascii = true): string {
    return pop(
      libmupdf._wasm_pdf_sprint_obj(this.pointer, tight, ascii),
    );
  }

  forEach(
    fn: (val: PDFObject, key: number | string, self: PDFObject) => void,
  ): void {
    if (this.isArray()) {
      const n = this.length;
      for (let i = 0; i < n; ++i) {
        fn(this.get(i), i, this);
      }
    } else if (this.isDictionary()) {
      const n = libmupdf._wasm_pdf_dict_len(this.pointer);
      for (let i = 0; i < n; ++i) {
        const key = keepPDFObject(
          this.#doc,
          libmupdf._wasm_pdf_dict_get_key(this.pointer, i),
        );
        const val = keepPDFObject(
          this.#doc,
          libmupdf._wasm_pdf_dict_get_val(this.pointer, i),
        );
        fn(val, key.asName(), this);
      }
    }
  }

  /**
   * Convert to plain Javascript values, objects, and arrays.
   * If you want to resolve indirect references, pass an empty object or array as the first argument.
   * On exit, this object will contain all indirect objects encountered indexed by object number.
   * Note: This function will omit cyclic references.
   *
   * @param seen
   * @returns
   */
  asJS(
    seen?: Record<number, JSValue>,
  ): JSValue {
    if (this.isIndirect()) {
      const ref = this.asIndirect();
      if (!seen) {
        return `${ref} 0 R`;
      }
      if (ref in seen) {
        return seen[ref];
      }
      seen[ref] = Null; // stop recursion!
      return seen[ref] = this.resolve().asJS(seen);
    }

    if (this.isArray()) {
      const result: JSValue[] = [];
      this.forEach((val) => {
        result.push(val.asJS(seen));
      });
      return result;
    }

    if (this.isDictionary()) {
      const result: Record<string, JSValue> = {};
      this.forEach((val, key) => {
        result[key] = val.asJS(seen);
      });
      return result;
    }

    return this.valueOf();
  }
}

export type JSValue =
  | PDFObject
  | string
  | number
  | boolean
  | null
  | JSValue[]
  | { [key: string]: JSValue };

export const Null: PDFObject = /* @__PURE__ */ new PDFObject(
  null as unknown as PDFDocument,
  0 as Pointer<"pdf_obj">,
);

export const toPDFObject = (
  document: PDFDocument,
  obj: PDFObjectLike,
): PDFObject => {
  if (obj instanceof PDFObject) {
    return obj;
  }
  if (obj === null || obj === undefined) {
    return Null;
  }
  if (typeof obj === "string") {
    // if a JS string is surrounded by parens, convert it to a PDF string
    if (obj.startsWith("(") && obj.endsWith(")")) {
      return makePDFStringObject(document, obj.slice(1, -1));
    }
    // otherwise treat it as a name
    return makePDFNameObject(document, obj);
  }
  if (typeof obj === "number") {
    if (obj === (obj | 0)) {
      return makePDFIntegerObject(document, obj);
    }
    return makePDFRealObject(document, obj);
  }
  if (typeof obj === "boolean") {
    return makePDFBooleanObject(document, obj);
  }
  if (obj instanceof Array) {
    const result = makePDFArrayObject(document, obj.length);
    for (const item of obj) {
      result.push(item);
    }
    return result;
  }
  const result = makePDFDictionaryObject(document);
  for (const key in obj) {
    result.put(key, obj[key as keyof typeof obj]);
  }
  return result;
};

/** Wrap a pdf_obj in a Userdata object. The pointer must be newly created or we already own it. */
export const makePDFObject = (
  document: PDFDocument,
  pointer = libmupdf._wasm_pdf_new_indirect(
    document.pointer,
    libmupdf._wasm_pdf_create_object(document.pointer),
  ),
): PDFObject => pointer === 0 ? Null : new PDFObject(document, pointer);

/** Wrap a pdf_obj in a Userdata object. The pointer must be a borrowed pointer, so we have to take ownership. */
export const keepPDFObject = (
  document: PDFDocument,
  pointer: Pointer<"pdf_obj">,
): PDFObject =>
  pointer === 0
    ? Null
    : new PDFObject(document, libmupdf._wasm_pdf_keep_obj(pointer));

export const makePDFBooleanObject = (
  document: PDFDocument,
  value: boolean,
): PDFObject => makePDFObject(document, libmupdf._wasm_pdf_new_bool(value));

export const makePDFIntegerObject = (
  document: PDFDocument,
  integer: number,
): PDFObject => makePDFObject(document, libmupdf._wasm_pdf_new_int(integer));

export const makePDFRealObject = (
  document: PDFDocument,
  real: number,
): PDFObject => makePDFObject(document, libmupdf._wasm_pdf_new_real(real));

export const makePDFNameObject = (
  document: PDFDocument,
  name: string,
): PDFObject =>
  makePDFObject(document, libmupdf._wasm_pdf_new_name(makeCharPtr(name)));

export const makePDFStringObject = (
  document: PDFDocument,
  text: string,
): PDFObject =>
  makePDFObject(
    document,
    libmupdf._wasm_pdf_new_text_string(makeCharPtr(text)),
  );

export const makePDFStringObjectFromByte = (
  document: PDFDocument,
  text: Uint8Array,
): PDFObject =>
  makePDFObject(
    document,
    libmupdf._wasm_pdf_new_text_string(
      makeCharPtr(new TextDecoder().decode(text)),
    ),
  );

export const makePDFIndirectObject = (
  document: PDFDocument,
  indirect: number,
): PDFObject =>
  makePDFObject(
    document,
    libmupdf._wasm_pdf_new_indirect(document.pointer, indirect),
  );

export const makePDFArrayObject = (
  document: PDFDocument,
  cap = 8,
): PDFObject =>
  makePDFObject(document, libmupdf._wasm_pdf_new_array(document.pointer, cap));

export const makePDFDictionaryObject = (
  document: PDFDocument,
  cap = 8,
): PDFObject =>
  makePDFObject(document, libmupdf._wasm_pdf_new_dict(document.pointer, cap));

export const makePDFGraftObject = (
  document: PDFDocument,
  pointer: Pointer<"pdf_obj">,
): PDFObject =>
  makePDFObject(
    document,
    libmupdf._wasm_pdf_graft_object(document.pointer, pointer),
  );
