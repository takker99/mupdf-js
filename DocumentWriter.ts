import type { Buffer } from "./buffer.ts";
import { Device } from "./device.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { RECT, type Rect } from "./Rect.ts";
import { makeCharPtr, makeCharPtr2 } from "./string.ts";

/**
 * This creates new documents in several formats.
 */
export class DocumentWriter implements Disposable {
  pointer: Pointer<"fz_document_writer">;
  [Symbol.dispose](): void {
    libmupdf._wasm_drop_document_writer(this.pointer);
  }

  /**
   * Create a new document writer to create a document with the specified format and output options. The options argument is a * comma separated list of flags and key-value pairs.
   *
   * The output format & options are the same as in the [mutool convert](https://mupdf.readthedocs.io/en/latest/mutool-convert.html#mutool-convert) command.
   *
   * @param buffer
   * @param format
   * @param options
   */
  constructor(buffer: Buffer, format: string, options: string) {
    this.pointer = libmupdf._wasm_new_document_writer_with_buffer(
      buffer.pointer,
      makeCharPtr(format),
      makeCharPtr2(options),
    );
  }

  beginPage(mediabox: Rect): Device {
    return new Device(libmupdf._wasm_begin_page(this.pointer, RECT(mediabox)));
  }

  endPage(): void {
    libmupdf._wasm_end_page(this.pointer);
  }

  close(): void {
    libmupdf._wasm_close_document_writer(this.pointer);
  }
}
