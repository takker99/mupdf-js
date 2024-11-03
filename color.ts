import { malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type Color = [number] | [number, number, number] | [
  number,
  number,
  number,
  number,
];

const _wasm_color = malloc<"number">(4 * 4) >> 2;

export const setCurrentColor = (c?: Color): Pointer<"float"> => {
  if (c) {
    libmupdf.HEAPF32[_wasm_color + 0] = c[0];
    if (c.length !== 1) {
      libmupdf.HEAPF32[_wasm_color + 0] = c[0];
      libmupdf.HEAPF32[_wasm_color + 1] = c[1];
      libmupdf.HEAPF32[_wasm_color + 2] = c[2];
      if (c.length !== 3) {
        libmupdf.HEAPF32[_wasm_color + 3] = c[3];
      }
    }
  }
  return _wasm_color << 2 as Pointer<"float">;
};

export const getCurrentColor = (n: 1 | 3 | 4): Color => {
  if (n === 1) {
    return [
      libmupdf.HEAPF32[_wasm_color] as number,
    ];
  }
  if (n === 3) {
    return [
      libmupdf.HEAPF32[_wasm_color + 0] as number,
      libmupdf.HEAPF32[_wasm_color + 1] as number,
      libmupdf.HEAPF32[_wasm_color + 2] as number,
    ];
  }
  return [
    libmupdf.HEAPF32[_wasm_color + 0] as number,
    libmupdf.HEAPF32[_wasm_color + 1] as number,
    libmupdf.HEAPF32[_wasm_color + 2] as number,
    libmupdf.HEAPF32[_wasm_color + 3] as number,
  ];
};
