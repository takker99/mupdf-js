import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export const malloc = <T extends string>(size: number): Pointer<T> =>
  libmupdf._wasm_malloc(size) as Pointer<T>;

export const free = <T extends string>(ptr: Pointer<T>): void =>
  libmupdf._wasm_free(ptr as Pointer<"void">);
