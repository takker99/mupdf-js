import { ENUM } from "./enum.ts";
import { libmupdf } from "./module.ts";
import type { Pointer } from "./Pointer.ts";

export type LineCap = "Butt" | "Round" | "Square" | "Triangle";
const LINE_CAP = [
  "Butt",
  "Round",
  "Square",
  "Triangle",
] as const satisfies LineCap[];
export type LineJoin = "Miter" | "Round" | "Bevel" | "MiterXPS";
const LINE_JOIN = [
  "Miter",
  "Round",
  "Bevel",
  "MiterXPS",
] as const satisfies LineJoin[];

// TODO: convert StrokeState from plain JS object to match mutool run ffi_pushstroke/ffi_tostroke
export class StrokeState implements Disposable {
  pointer: Pointer<"fz_stroke_state">;

  [Symbol.dispose](): void {
    libmupdf._wasm_drop_stroke_state(this.pointer);
  }

  constructor(pointer?: Pointer<"fz_stroke_state">) {
    this.pointer = pointer ?? libmupdf._wasm_new_stroke_state();
  }

  get lineCap(): LineCap {
    const index = libmupdf._wasm_stroke_state_get_start_cap(this.pointer);
    return LINE_CAP[index];
  }

  set lineCap(cap: LineCap) {
    const jj = LINE_CAP.indexOf(cap);
    libmupdf._wasm_stroke_state_set_start_cap(this.pointer, jj);
    libmupdf._wasm_stroke_state_set_dash_cap(this.pointer, jj);
    libmupdf._wasm_stroke_state_set_end_cap(this.pointer, jj);
  }

  get lineJoin(): LineJoin {
    const index = libmupdf._wasm_stroke_state_get_linejoin(this.pointer);
    return LINE_JOIN[index];
  }
  set lineJoin(j: LineJoin) {
    const jj = ENUM<LineJoin>(j, LINE_JOIN);
    libmupdf._wasm_stroke_state_set_linejoin(this.pointer, jj);
  }

  get lineWidth(): number {
    return libmupdf._wasm_stroke_state_get_linewidth(this.pointer);
  }
  set lineWidth(w: number) {
    libmupdf._wasm_stroke_state_set_linewidth(this.pointer, w);
  }

  get miterLimit(): number {
    return libmupdf._wasm_stroke_state_get_miterlimit(this.pointer);
  }
  set miterLimit(m: number) {
    libmupdf._wasm_stroke_state_set_miterlimit(this.pointer, m);
  }

  // TODO: dashes
}
