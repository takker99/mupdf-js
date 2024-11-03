import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { makeCharPtr, toText } from "./string.ts";

/** The types that can be automatically converted into a Buffer object */
export type AnyBuffer = Buffer | ArrayBuffer | Uint8Array | string;

export const makeBufferPtr = (input: AnyBuffer): Pointer<"fz_buffer"> => {
  if (input instanceof Buffer) return input.pointer;
  return new Buffer(input).pointer;
};

export function toUint8Array(ptr: Pointer<"fz_buffer">): Uint8Array {
  const data = libmupdf._wasm_buffer_get_data(ptr);
  const size = libmupdf._wasm_buffer_get_len(ptr);
  return libmupdf.HEAPU8.slice(data, data + size);
}

const toBufferPtr = (input: ArrayBuffer | Uint8Array): Pointer<"fz_buffer"> => {
  const data_len = input.byteLength;
  const data_ptr = malloc<"char">(data_len);
  libmupdf.HEAPU8.set(new Uint8Array(input), data_ptr);
  return libmupdf._wasm_new_buffer_from_data(data_ptr, data_len);
};

/** Buffer objects are used for working with binary data. They can be used much like arrays, but are much more efficient since they only store bytes. */
export class Buffer extends WritableStream<AnyBuffer> implements Disposable {
  pointer: Pointer<"fz_buffer">;

  [Symbol.dispose](): void {
    libmupdf._wasm_drop_buffer(this.pointer);
  }

  constructor(arg?: string | Pointer<"fz_buffer"> | Uint8Array | ArrayBuffer) {
    let pointer: Pointer<"fz_buffer">;
    if (!arg) {
      pointer = libmupdf._wasm_new_buffer(1024);
    } else if (typeof arg === "number") {
      pointer = arg;
    } else if (typeof arg === "string") {
      const data_len = libmupdf.lengthBytesUTF8(arg);
      const data_ptr = malloc<"char">(data_len + 1);
      libmupdf.stringToUTF8(arg, data_ptr, data_len + 1);
      pointer = libmupdf._wasm_new_buffer_from_data(data_ptr, data_len);
    } else {
      pointer = toBufferPtr(arg);
    }

    super({
      write: (chunk) => {
        if (typeof chunk === "string") {
          libmupdf._wasm_append_string(this.pointer, makeCharPtr(chunk));
          return;
        }
        libmupdf._wasm_append_buffer(
          this.pointer,
          chunk instanceof Buffer ? chunk.pointer : toBufferPtr(chunk),
        );
      },
    });

    this.pointer = pointer;
  }

  get size(): number {
    return libmupdf._wasm_buffer_get_len(this.pointer);
  }

  at(at: number): number {
    const data = libmupdf._wasm_buffer_get_data(this.pointer);
    return libmupdf.HEAPU8[data + at] as number;
  }

  toText(): string {
    return toText(libmupdf._wasm_string_from_buffer(this.pointer));
  }
}
