import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type Quad = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const _wasm_quad = malloc<"fz_quad">(4 * 8) >> 2;

export function QUAD(q: Quad) {
  libmupdf.HEAPF32[_wasm_quad + 0] = q[0];
  libmupdf.HEAPF32[_wasm_quad + 1] = q[1];
  libmupdf.HEAPF32[_wasm_quad + 2] = q[2];
  libmupdf.HEAPF32[_wasm_quad + 3] = q[3];
  libmupdf.HEAPF32[_wasm_quad + 4] = q[4];
  libmupdf.HEAPF32[_wasm_quad + 5] = q[5];
  libmupdf.HEAPF32[_wasm_quad + 6] = q[6];
  libmupdf.HEAPF32[_wasm_quad + 7] = q[7];
  return _wasm_quad << 2 as Pointer<"fz_quad">;
}

export function fromQuad(ptr: Pointer<"fz_quad">): Quad {
  const addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0] as number,
    libmupdf.HEAPF32[addr + 1] as number,
    libmupdf.HEAPF32[addr + 2] as number,
    libmupdf.HEAPF32[addr + 3] as number,
    libmupdf.HEAPF32[addr + 4] as number,
    libmupdf.HEAPF32[addr + 5] as number,
    libmupdf.HEAPF32[addr + 6] as number,
    libmupdf.HEAPF32[addr + 7] as number,
  ];
}
