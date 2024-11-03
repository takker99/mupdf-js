/* We need a certain level of ugliness to allow callbacks from C to JS */
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

let $libmupdf_stm_id = 0;
interface StreamHandle {
  read(
    buffer: Uint8Array,
    addr: number,
    size: number,
    pos: number,
  ): number;
  fileSize(): number;
  close(): void;
}
const $libmupdf_stm_table = new Map<number, StreamHandle>();
const getStreamHandle = (id: number) => {
  const handle = $libmupdf_stm_table.get(id);
  if (!handle) throw new Error("invalid file handle");
  return handle;
};

// @ts-expect-error - globalThis
globalThis.$libmupdf_stm_close = (id: number) => {
  const handle = getStreamHandle(id);
  handle.close();
  $libmupdf_stm_table.delete(id);
};

// @ts-expect-error - globalThis
globalThis.$libmupdf_stm_seek = (
  id: number,
  pos: number,
  offset: number,
  whence: number,
) => {
  const handle = getStreamHandle(id);
  if (whence === 0) return offset;
  if (whence === 1) return pos + offset;
  if (whence === 2) return handle.fileSize() + offset;
  throw new Error("invalid whence argument");
};

// @ts-expect-error - globalThis
globalThis.$libmupdf_stm_read = (
  id: number,
  pos: number,
  addr: number,
  size: number,
) => getStreamHandle(id).read(libmupdf.HEAPU8, addr, size, pos);

export class Stream implements Disposable {
  pointer: Pointer<"fz_stream">;
  [Symbol.dispose](): void {
    libmupdf._wasm_drop_stream(this.pointer);
  }
  constructor(handle: StreamHandle) {
    const id = $libmupdf_stm_id++;
    $libmupdf_stm_table.set(id, handle);
    this.pointer = libmupdf._wasm_new_stream(id);
  }
}
