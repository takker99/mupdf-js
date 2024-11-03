import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type Matrix = [number, number, number, number, number, number];

export const identity: Matrix = [1, 0, 0, 1, 0, 0];

export const scale = (sx: number, sy: number): Matrix => [sx, 0, 0, sy, 0, 0];

export const translate = (
  tx: number,
  ty: number,
): Matrix => [1, 0, 0, 1, tx, ty];

export const rotate = (d: number): Matrix => {
  while (d < 0) {
    d += 360;
  }
  while (d >= 360) {
    d -= 360;
  }
  const s = Math.sin((d * Math.PI) / 180);
  const c = Math.cos((d * Math.PI) / 180);
  return [c, s, -s, c, 0, 0];
};

export const invert = (m: Matrix): Matrix => {
  const det = m[0] * m[3] - m[1] * m[2];
  if (det > -1e-23 && det < 1e-23) {
    return m;
  }
  const rdet = 1 / det;
  const inva = m[3] * rdet;
  const invb = -m[1] * rdet;
  const invc = -m[2] * rdet;
  const invd = m[0] * rdet;
  const inve = -m[4] * inva - m[5] * invc;
  const invf = -m[4] * invb - m[5] * invd;
  return [inva, invb, invc, invd, inve, invf];
};

export const concat = (one: Matrix, two: Matrix): Matrix => [
  one[0] * two[0] + one[1] * two[2],
  one[0] * two[1] + one[1] * two[3],
  one[2] * two[0] + one[3] * two[2],
  one[2] * two[1] + one[3] * two[3],
  one[4] * two[0] + one[5] * two[2] + two[4],
  one[4] * two[1] + one[5] * two[3] + two[5],
];

const _wasm_matrix = /* @__PURE__ */ malloc<"fz_matrix">(4 * 6) >> 2;

export const MATRIX = (m: Matrix): Pointer<"fz_matrix"> => {
  libmupdf.HEAPF32[_wasm_matrix + 0] = m[0];
  libmupdf.HEAPF32[_wasm_matrix + 1] = m[1];
  libmupdf.HEAPF32[_wasm_matrix + 2] = m[2];
  libmupdf.HEAPF32[_wasm_matrix + 3] = m[3];
  libmupdf.HEAPF32[_wasm_matrix + 4] = m[4];
  libmupdf.HEAPF32[_wasm_matrix + 5] = m[5];
  return _wasm_matrix << 2 as Pointer<"fz_matrix">;
};

export const fromMatrix = (ptr: Pointer<"fz_matrix">): Matrix => {
  const addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0],
    libmupdf.HEAPF32[addr + 1],
    libmupdf.HEAPF32[addr + 2],
    libmupdf.HEAPF32[addr + 3],
    libmupdf.HEAPF32[addr + 4],
    libmupdf.HEAPF32[addr + 5],
  ];
};
