import { free, malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

const nullptr = 0 as Pointer<"char">;

const _wasm_string: [Pointer<"char">, Pointer<"char">] = [nullptr, nullptr];

export const makeCharPtr2 = (s: string): Pointer<"char"> => makeCharPtr_(s, 1);

export const makeCharPtr = (s?: string) =>
  typeof s === "string" ? makeCharPtr_(s, 0) : nullptr;

export function STRING2_OPT(s: string | null | undefined) {
  return typeof s === "string" ? makeCharPtr2(s) : nullptr;
}

export const toText = (ptr: Pointer<"char">): string =>
  libmupdf.UTF8ToString(ptr);

export const pop = (ptr: Pointer<"char">): string => {
  const str = toText(ptr);
  free(ptr);
  return str;
};

const makeCharPtr_ = (s: string, i: 0 | 1): Pointer<"char"> => {
  if (_wasm_string[i]) {
    free(_wasm_string[i]);
    _wasm_string[i] = nullptr;
  }
  return _wasm_string[i] = allocate(s);
};

const allocate = (str: string) => {
  const size = libmupdf.lengthBytesUTF8(str) + 1;
  const pointer = malloc<"char">(size);
  libmupdf.stringToUTF8(str, pointer, size);
  return pointer;
};
