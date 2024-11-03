import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type Point = [number, number];

export function checkPoint(value: unknown): asserts value is Point {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError("expected point");
  }
}

export const _wasm_point = malloc<"fz_point">(4 * 6) >> 2;

export function POINT(p: Point) {
  libmupdf.HEAPF32[_wasm_point + 0] = p[0];
  libmupdf.HEAPF32[_wasm_point + 1] = p[1];
  return _wasm_point << 2 as Pointer<"fz_point">;
}

export function POINT2(p: Point) {
  libmupdf.HEAPF32[_wasm_point + 2] = p[0];
  libmupdf.HEAPF32[_wasm_point + 3] = p[1];
  return (_wasm_point + 2) << 2 as Pointer<"fz_point">;
}

export function POINT3(p: Point) {
  libmupdf.HEAPF32[_wasm_point + 4] = p[0];
  libmupdf.HEAPF32[_wasm_point + 5] = p[1];
  return (_wasm_point + 4) << 2 as Pointer<"fz_point">;
}

export function fromPoint(ptr: Pointer<"fz_point">): Point {
  const addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0] as number,
    libmupdf.HEAPF32[addr + 1] as number,
  ];
}
