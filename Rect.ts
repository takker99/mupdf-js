import type { Matrix } from "./Matrix.ts";
import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type Rect = [number, number, number, number];

export const MIN_INF_RECT = 0x80000000;
export const MAX_INF_RECT = 0x7fffff80;
export const isEmpty = (rect: Rect): boolean =>
  rect[0] >= rect[2] || rect[1] >= rect[3];
export const isValid = (rect: Rect): boolean =>
  rect[0] <= rect[2] && rect[1] <= rect[3];
export const isInfinite = (rect: Rect): boolean =>
  rect[0] === MIN_INF_RECT && rect[1] === MIN_INF_RECT &&
  rect[2] === MAX_INF_RECT && rect[3] === MAX_INF_RECT;

export const transform = (rect: Rect, matrix: Matrix): Rect => {
  let t;

  if (isInfinite(rect)) {
    return rect;
  }
  if (!isValid(rect)) {
    return rect;
  }

  let ax0 = rect[0] * matrix[0];
  let ax1 = rect[2] * matrix[0];
  if (ax0 > ax1) {
    t = ax0, ax0 = ax1, ax1 = t;
  }

  let cy0 = rect[1] * matrix[2];
  let cy1 = rect[3] * matrix[2];
  if (cy0 > cy1) {
    t = cy0, cy0 = cy1, cy1 = t;
  }

  ax0 += cy0 + matrix[4];
  ax1 += cy1 + matrix[4];

  let bx0 = rect[0] * matrix[1];
  let bx1 = rect[2] * matrix[1];
  if (bx0 > bx1) {
    t = bx0, bx0 = bx1, bx1 = t;
  }

  let dy0 = rect[1] * matrix[3];
  let dy1 = rect[3] * matrix[3];
  if (dy0 > dy1) {
    t = dy0, dy0 = dy1, dy1 = t;
  }

  bx0 += dy0 + matrix[5];
  bx1 += dy1 + matrix[5];

  return [ax0, bx0, ax1, bx1];
};

const _wasm_rect = /* @__PURE__ */ malloc<"fz_rect">(4 * 8) >> 2;

export const RECT = (r: Rect): Pointer<"fz_rect"> => {
  libmupdf.HEAPF32[_wasm_rect + 0] = r[0];
  libmupdf.HEAPF32[_wasm_rect + 1] = r[1];
  libmupdf.HEAPF32[_wasm_rect + 2] = r[2];
  libmupdf.HEAPF32[_wasm_rect + 3] = r[3];
  return _wasm_rect << 2 as Pointer<"fz_rect">;
};

export const RECT2 = (r: Rect): Pointer<"fz_rect"> => {
  libmupdf.HEAPF32[_wasm_rect + 4] = r[0];
  libmupdf.HEAPF32[_wasm_rect + 5] = r[1];
  libmupdf.HEAPF32[_wasm_rect + 6] = r[2];
  libmupdf.HEAPF32[_wasm_rect + 7] = r[3];
  return (_wasm_rect + 4) << 2 as Pointer<"fz_rect">;
};

export const fromRect = (ptr: Pointer<"fz_rect">): Rect => {
  const addr = ptr >> 2;
  return [
    libmupdf.HEAPF32[addr + 0] as number,
    libmupdf.HEAPF32[addr + 1] as number,
    libmupdf.HEAPF32[addr + 2] as number,
    libmupdf.HEAPF32[addr + 3] as number,
  ];
};
