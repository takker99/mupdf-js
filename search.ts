import { free, malloc } from "./memory.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";
import { fromQuad, type Quad } from "./quad.ts";
import { makeCharPtr } from "./string.ts";

export type SearchFunction<T extends string> = (
  display_list: Pointer<T>,
  needle: Pointer<"char">,
  marks: Pointer<"int">,
  hits: Pointer<"fz_quad">,
  hit_max: number,
) => number;

export const runSearch = <T extends string>(
  searchFun: SearchFunction<T>,
  searchThis: Pointer<T>,
  needle: string,
  max_hits = 500,
) => {
  let hits = 0 as Pointer<"fz_quad">;
  let marks = 0 as Pointer<"int">;
  try {
    hits = malloc<"fz_quad">(32 * max_hits);
    marks = malloc<"int">(4 * max_hits);
    const n = searchFun(
      searchThis,
      makeCharPtr(needle),
      marks,
      hits,
      max_hits,
    );
    const outer: Quad[][] = [];
    if (n > 0) {
      let inner: Quad[] = [];
      for (let i = 0; i < n; ++i) {
        const mark = libmupdf.HEAP32[(marks >> 2) + i];
        const quad = fromQuad(hits + i * 32 as Pointer<"fz_quad">);
        if (i > 0 && mark) {
          outer.push(inner);
          inner = [];
        }
        inner.push(quad);
      }
      outer.push(inner);
    }
    return outer;
  } finally {
    free(marks);
    free(hits);
  }
};
